import { LLM_LOGGER_API_KEY, OPENAI_API_KEY } from '@backend/config';
import { LLMLogger } from 'llm-logger';
import OpenAI from 'openai';
import { ChatCompletionMessageParam, ChatCompletionTool } from 'openai/resources/index.mjs';

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
const logger = new LLMLogger({ apiKey: LLM_LOGGER_API_KEY });

export const AIService = {
  makeRequest: async function (
    messages: Array<ChatCompletionMessageParam>,
    tags: string[],
    user: string | null,
    model: string = 'gpt-4o-mini',
    tools: ChatCompletionTool[] | undefined = undefined,
    useJson: boolean = false,
  ): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model,
        messages,
        tools,
        response_format: { type: useJson ? 'json_object' : 'text' },
      });
      // @ts-ignore
      await logger.openaiLog(messages, response, tags, user);

      const answer = response.choices[0].message;
      if (!answer?.content) {
        throw new Error('No answer from GPT');
      }
      return answer.content;
    } catch (e) {
      console.error(e);
      throw e;
    }
  },
};

export function system(content: string): ChatCompletionMessageParam {
  return {
    role: 'system',
    content,
  };
}

export function assistant(content: string): ChatCompletionMessageParam {
  return {
    role: 'assistant',
    content,
  };
}

export function user(content: string): ChatCompletionMessageParam {
  return {
    role: 'user',
    content,
  };
}
