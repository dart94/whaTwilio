import { Twilio } from 'twilio';

export const sendMessage = async (
  to: string,
  contentSid: string,
  contentVariables: { [key: string]: string },
  messagingServiceSid: string,
  accountSid: string,
  authToken: string
) => {
  const client = new Twilio(accountSid, authToken);

  return await client.messages.create({
    messagingServiceSid, // 👈 aquí en vez de 'from'
    to,
    contentSid,
    contentVariables: JSON.stringify(contentVariables),
  });
};
