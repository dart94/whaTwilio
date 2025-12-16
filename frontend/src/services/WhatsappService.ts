import type {
  TemplateComponent,
  WhatsAppTemplate,
} from "../types/WhatsappTypes";

export interface TemplatesResponse {
  data: WhatsAppTemplate[];
  paging?: {
    cursors?: {
      before?: string;
      after?: string;
    };
  };
}

export const fetchWhatsAppTemplates = async (
  businessId: string,
  accessToken: string
): Promise<TemplatesResponse> => {
  const url = `https://graph.facebook.com/v23.0/${businessId}/message_templates`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Error fetching templates: ${error.error?.message}`);
  }

  const data = await response.json();
  return data;
};
