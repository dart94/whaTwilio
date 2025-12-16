export interface TemplateComponent {
  type: string;
  text?: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  status: string;
  category: string;
  components: TemplateComponent[];
}