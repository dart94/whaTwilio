import React, { useState, useEffect } from 'react';
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
  variables?: Record<string, string>;
  sid?: string;
}

interface VariableMapping {
  [variable: string]: string;
}

interface CredentialSelectorProps {
  credentials: any[];
  selectedCredential: string;
  onCredentialChange: (credential: string) => void;
  onTemplatesEncontradas: (templates: any[]) => void;
  onTemplateSelect: (template: any) => void;
  headers: string[];
  onVariableMappingChange: (mapping: Record<string, string>) => void;
}

const CredentialSelector: React.FC<CredentialSelectorProps> = ({
  credentials,
  selectedCredential,
  onCredentialChange,
  onTemplatesEncontradas,
  onTemplateSelect,
  headers = [],
  onVariableMappingChange
}) => {
  const [templatesFound, setTemplatesFound] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [templateVariables, setTemplateVariables] = useState<string[]>([]);
  const [variableMapping, setVariableMapping] = useState<VariableMapping>({});
  const [exampleValues, setExampleValues] = useState<Record<string, string>>({});

  // Función para extraer variables con el patrón {{número}} del cuerpo de la plantilla
  const extractVariables = (templateBody: string): string[] => {
    if (!templateBody) return [];
    const regex = /{{([^{}]+)}}/g;
    const matches = templateBody.match(regex) || [];
    const variables = matches.map(match => match.replace(/{{|}}/g, ''));
    return [...new Set(variables)]; // Elimina duplicados
  };

  const handleBuscarPlantilla = async () => {
    if (!selectedCredential) {
      toast.error('Seleccione una credencial primero');
      return;
    }
  
    try {
      const credentialSelected = credentials.find(cred => cred.name === selectedCredential);
      if (!credentialSelected) {
        toast.error('Credencial no encontrada');
        return;
      }
  
      const templates = await getContentTemplates(credentialSelected.name);
      
      if (!templates) {
        toast.error('Error al buscar plantillas');
        return;
      }
      
      setTemplatesFound(templates);
      setSelectedTemplate('');
      setTemplateVariables([]);
      setVariableMapping({});
      setExampleValues({});
      
      // Notificar al padre sobre las plantillas encontradas
      if (onTemplatesEncontradas) {
        onTemplatesEncontradas(templates);
      }
      
      // Si hay plantillas, seleccionar y notificar la primera automáticamente
      if (templates.length > 0) {
        const firstTemplate = templates[0];
        setSelectedTemplate(firstTemplate.sid || firstTemplate.id || firstTemplate.friendly_name || '');
        
        if (onTemplateSelect) {
          onTemplateSelect(firstTemplate);
        }
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

  // Efecto: actualizar las variables de la plantilla seleccionada
  useEffect(() => {
    if (selectedTemplate) {
      const selectedTemplateObj = templatesFound.find(
        t => t.id === selectedTemplate || t.sid === selectedTemplate || t.friendly_name === selectedTemplate
      );
      
      if (selectedTemplateObj) {
        // Notificar al padre sobre la plantilla seleccionada
        if (onTemplateSelect) {
          onTemplateSelect(selectedTemplateObj);
        }
        
        if (selectedTemplateObj?.body) {
          const variables = extractVariables(selectedTemplateObj.body);
          setTemplateVariables(variables);
          setVariableMapping({});
          
          if (selectedTemplateObj.variables) {
            setExampleValues(selectedTemplateObj.variables);
          } else {
            setExampleValues({});
          }
        }
      }
    } else {
      setTemplateVariables([]);
      setExampleValues({});
    }
  }, [selectedTemplate, templatesFound]);

  // Manejar el cambio de mapeo para cada variable
  const handleVariableMapping = (variable: string, header: string) => {
    const newMapping = { ...variableMapping, [variable]: header };
    setVariableMapping(newMapping);
    
    if (onVariableMappingChange) {
      onVariableMappingChange(newMapping);
    }
  };

  // Función para obtener el valor de ejemplo de una variable
  const getExampleValue = (variable: string): string => {
    // Para variables numéricas como "1", "2", etc.
    return exampleValues[variable] || '';
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
      
      {/* Selector de Plantillas */}
      {templatesFound.length > 0 && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Plantillas encontradas</label>
          <div className={styles.inputGroup}>
          <select
            value={selectedTemplate}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setSelectedTemplate(selectedValue);
              
              // Encuentra la plantilla seleccionada y notifica al padre
              const selectedTemplateObj = templatesFound.find(
                t => t.sid === selectedValue || t.id === selectedValue || t.friendly_name === selectedValue
              );
              
              if (selectedTemplateObj && onTemplateSelect) {
                onTemplateSelect(selectedTemplateObj);
              }
            }}
            className={styles.select}
          >
              <option value="">Seleccionar plantilla</option>
              {templatesFound.map((template) => (
                <option 
                  key={template.sid || template.friendly_name || Math.random().toString()}
                  value={template.sid || template.id || template.friendly_name} 
                  className={styles.option}
                >
                  {template.friendly_name || `Plantilla ${template.sid || ''}`}
                </option> 
              ))}
            </select>
            <TooltipSMS body={templatesFound.find(t => 
              t.id === selectedTemplate || 
              t.sid === selectedTemplate || 
              t.friendly_name === selectedTemplate
            )?.body || ''} />
          </div>
        </div>
      )}
      
      {/* Visualización de variables extraídas de la plantilla */}
      {templateVariables.length > 0 && (
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Variables de la plantilla</label>
          <div className={styles.variablesGrid}>
            {templateVariables.map((variable, index) => {
              const exampleValue = getExampleValue(variable);
              return (
                <div key={index} className={styles.variableItem}>
                  <div className={styles.variableHeader}>
                    <span className={styles.variableName}>{"{{" + variable + "}} → " + exampleValue}</span>
                    {exampleValue && (
                      <span className={styles.variableExample}>
                        {` → Ejemplo: ${exampleValue}`}
                      </span>
                    )}
                  </div>
                  <select
                    className={styles.variableSelect}
                    value={variableMapping[variable] || ''}
                    onChange={(e) => handleVariableMapping(variable, e.target.value)}
                  >
                    <option value="">Seleccionar campo</option>
                    {headers.length > 0 ? (
                      headers.map((header, headerIndex) => (
                        <option key={headerIndex} value={header}>
                          {header}
                        </option>
                      ))
                    ) : (
                      <option value="">No hay campos disponibles</option>
                    )}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default CredentialSelector;