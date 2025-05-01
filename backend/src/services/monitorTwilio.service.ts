// src/services/monitorTwilio.service.ts
import { Twilio } from 'twilio';

interface TwilioCredentials {
  accountSid: string;
  authToken: string;
}

export const getTwilioLogsService = async ({ accountSid, authToken }: TwilioCredentials) => {
  const client = new Twilio(accountSid, authToken);

  const messages = await client.messages.list({ limit: 50 });

  return messages.map((msg) => ({
    sid: msg.sid,
    dateCreated: msg.dateCreated?.toISOString() || '',
    from: msg.from,
    to: msg.to,
    status: msg.status,
    body: msg.body || '',
  }));
};
