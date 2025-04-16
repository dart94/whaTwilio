// frontend/src/components/CredentialSelector.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getContentTemplates } from '../../services/Twilio';
import styles from '../../styles/AsociarCredencialesView.module.css';
import TooltipSMS from './Body';

interface Credential {
  id: string;
  name: string;
}

interface Template {
  id?: string;
  name: string;
  friendly_name?: string;
  body: string;
}

interface CredentialSelectorProps {
  credentials: Credential[];
  selectedCredential: string;
  onCredentialChange: (newValue: string) => void;
  onTemplatesEncontradas?: (templates: Template[]) => void;
}

const CredentialSelector: React.FC<CredentialSelectorProps> = ({
  credentials,
  selectedCredential,
  onCredentialChange,
  onTemplatesEncontradas
}) => {
  // Estado para las plantillas encontradas y la plantilla seleccionada
  const [templatesFound, setTemplatesFound] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const handleBuscarPlantilla = async () => {
    if (!selectedCredential) {
      toast.error('Seleccione una credencial primero');
      return;
    }

    try {
      // Se busca la credencial seleccionada para utilizar su nombre en la búsqueda
      const credentialSelected = credentials.find(cred => cred.name === selectedCredential);
      if (!credentialSelected) {
        toast.error('Credencial no encontrada');
        return;
      }

      console.log("Buscando plantillas para la credencial:", credentialSelected.name);
      const templates = await getContentTemplates(credentialSelected.name);
      
      if (!templates) {
        toast.error('Error al buscar plantillas');
        return;
      }
      
      // Guardar las plantillas en el estado local y pasarlas al componente padre si corresponde
      setTemplatesFound(templates);
      if (onTemplatesEncontradas) {
        onTemplatesEncontradas(templates);
      }
      
      if (templates.length === 0) {
        toast.error('No se encontró ninguna plantilla para esta credencial');
      } else {
        toast.success(`Se encontraron ${templates.length} plantilla(s)`);
      }
    } catch (error) {
      console.error("Error al buscar plantillas:", error);
      toast.error('Error al buscar plantillas');
    }
  };

  return (
    <div>
      {/* Selector de Credenciales */}
      <div className={styles.fieldGroup}>
        <label className={styles.label}>Credenciales Twilio</label>
        <div className={styles.inputGroup}>
          <select
            value={selectedCredential}
            onChange={(e) => onCredentialChange(e.target.value)}
            className={styles.select}
            disabled={credentials.length === 0}
          >
            <option value="">Seleccionar credencial</option>
            {credentials.map((credential) => (
              <option key={credential.name} value={credential.name} className={styles.option}>
                {credential.name}
              </option>
            ))}
          </select>
          
          {onTemplatesEncontradas && (
            <button 
              className={styles.button} 
              onClick={handleBuscarPlantilla}
              disabled={!selectedCredential}
            >
              Buscar Plantillas
            </button>
          )}
        </div>
      </div>
      
      {/* Selector de Plantillas, mostrado sólo si se encontraron plantillas */}
      {templatesFound.length > 0 && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Plantillas encontradas</label>
          <div className={styles.inputGroup}>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className={styles.select}
            >
              <option value="">Seleccionar plantilla</option>
              {templatesFound.map((template, index) => (
                <option 
                  key={template.friendly_name || index}
                  value={template.id || template.friendly_name} 
                  className={styles.option}
                >
                  {template.friendly_name || `Plantilla ${index + 1}`}
                </option>
              ))}
            </select>
            <TooltipSMS body={templatesFound.find(t => t.id === selectedTemplate || t.friendly_name === selectedTemplate)?.body || ''} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CredentialSelector;
