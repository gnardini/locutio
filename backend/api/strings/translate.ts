import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { AIService, system } from '@backend/services/AIService';
import OrganizationsService from '@backend/services/OrganizationsService';
import { StringsService } from '@backend/services/StringsService';
import { translateSchema } from '@backend/schemas/translate';

const handler = createApiHandler({
  method: 'POST',
  schema: translateSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    const { organizationId, language, file } = data;

    const organization = await OrganizationsService.getOrganizationById(organizationId);
    if (!organization?.baseLanguage) {
      throw new ApiError(404, 'Org not found or not set up with base language');
    }

    const [baseStrings, languageStrings] = await Promise.all([
      StringsService.fetchStrings(organizationId, organization.baseLanguage, file),
      StringsService.fetchStrings(organizationId, language, file),
    ]);

    const response = await AIService.makeRequest([
      system(
        `You are the Senior ${
          organization.baseLanguage
        } to ${language} translator at Locutio, an agency that translates content for startups and big companies.
You will receive the ${
          organization.baseLanguage
        } contents of the client's website and provide strings in ${language} as a result.

The client's app is called ${organization.name}, here is its description: ${
          organization.description
        }

Here is the ${organization.baseLanguage} file:
${JSON.stringify(baseStrings, null, 2)}

${
  Object.keys(languageStrings).length > 0
    ? `Here is the ${language} file:
  ${JSON.stringify(languageStrings, null, 2)}`
    : ''
}

Output a JSON with the new or updated ${language} strings. If there are strings that are already properly translated, you don't need to include them in your response.`,
      ),
    ]);

    let translatedStrings: Record<string, string>;
    try {
      translatedStrings = JSON.parse(response);
    } catch (error) {
      throw new ApiError(500, 'Failed to parse AI response');
    }

    for (const [key, value] of Object.entries(translatedStrings)) {
      await StringsService.updateString(organizationId, language, file, key, value);
    }

    return { success: true };
  },
});

export default handler;
