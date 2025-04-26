import { Twilio } from 'twilio';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

const accountSid = "AC6c3d6ce185b11c304be26b2185d97cf7";
const authToken = "ef6554437011da40e10b3182170cdea0";
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
