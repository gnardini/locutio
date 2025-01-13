import { DISCORD_WEBHOOK } from '@backend/config';

const WAITLIST_WEBHOOK_URL = DISCORD_WEBHOOK;

export const DiscordService = {
  sendNewWaitlistMember: async function (email: string) {
    try {
      await fetch(WAITLIST_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: `New waitlist member: ${email}`,
        }),
      });
      console.info('Discord message sent successfully!');
    } catch (err) {
      console.error(`Error sending Discord message: ${err}`);
      throw err;
    }
  },
};
