import { Twilio } from 'twilio';

export const sendMessage = async (
  to: string,
  contentSid: string,
  contentVariables: { [key: string]: string },
  from: string,
  accountSid: string,
  authToken: string
) => {
  const client = new Twilio(accountSid, authToken);

  return await client.messages.create({
    from,
    to,
    contentSid,
    contentVariables: JSON.stringify(contentVariables),
  });
};
