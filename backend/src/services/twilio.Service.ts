import { Twilio } from 'twilio';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

const accountSid = "REMOVED_TWILIO_ACCOUNT_SID";
const authToken = "REMOVED_TWILIO_AUTH_TOKEN";
const whatsappNumber = "whatsapp:+5216624216955";

const client = new Twilio(accountSid, authToken);

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
  console.log(`Mensaje enviado a ${to} con SID: ${contentSid}`);
};
