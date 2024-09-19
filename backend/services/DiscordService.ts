const WAITLIST_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1214467725112377374/gGZyrGYj7taJnD8hil5H2eX7a1F2dQZ8RSMtF-IpWg_emad5IZpwvDXfQHy32JF9uPOW";

export const DiscordService = {
  sendNewWaitlistMember: async function (email: string) {
    try {
      await fetch(WAITLIST_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: `New waitlist member: ${email}`,
        }),
      });
      console.info("Discord message sent successfully!");
    } catch (err) {
      console.error(`Error sending Discord message: ${err}`);
      throw err;
    }
  },
};
