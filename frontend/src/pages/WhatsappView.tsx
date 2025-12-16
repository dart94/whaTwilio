import React, { useEffect, useState } from 'react';
import { fetchWhatsAppTemplates } from '../services/WhatsappService';
import { WhatsAppTemplate } from '../types/WhatsappTypes';

const WhatsAppTemplates: React.FC = () => {
    const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const businessId = '1036720168621958';
    const accessToken = 'REMOVED_FACEBOOK_ACCESS_TOKEN';

    useEffect(() => {
        const loadTemplates = async ()=>{
            setLoading(true);
            setError(null);
            try {
                const data = await fetchWhatsAppTemplates(businessId, accessToken);
                setTemplates(data.data);
            } catch (e: any) {
                setError(e.message || 'Failed to fetch templates');
            } finally {
                setLoading(false);
            }
        };
        loadTemplates();
    },[businessId, accessToken]);
        
 return (
    <div>
      <h2>WhatsApp Templates</h2>

      {loading && <p>Loading templates...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && templates.length > 0 && (
        <ul>
          {templates.map((template) => (
            <li key={template.id}>
              <strong>{template.name}</strong> ({template.language}) - Status: {template.status}
              <br />
              Category: {template.category}
              <br />
              {template.components.map((comp, idx) => (
                <div key={idx}>
                  {comp.type === 'BODY' && (
                    <p>Body: {comp.text}</p>
                  )}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && templates.length === 0 && (
        <p>No templates found.</p>
      )}
    </div>
  );
};

export default WhatsAppTemplates;