import { Twilio } from 'twilio';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

const accountSid = "REMOVED_TWILIO_ACCOUNT_SID";
const authToken = "REMOVED_TWILIO_AUTH_TOKEN";
const whatsappNumber = "whatsapp:+5216624216955";

const client = new Twilio(accountSid, authToken);

export const sendMessage = async (to: string, body: string) => {
  try{
  return await client.messages.create({
    from: whatsappNumber,
    to: to,
    body: body,
  });
  } catch (error) {
    console.error(`❌ Error al enviar mensaje a ${to}:`, error);
    throw error;
  }
  }
