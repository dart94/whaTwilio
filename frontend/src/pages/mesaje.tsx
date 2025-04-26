import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/Mesaje.module.css";
import SubcuentaSelectorId from "../components/forms/formsUser/SubcuentaSelectorId";
import BuscarCampaignId from "../components/forms/formsUser/BuscarCampaingId";

import DestinatariosId from "../components/forms/formsUser/DestinatariosId";
import TemplateSelectorId from "../components/forms/formsUser/TemplateId";
import NumeroSelectorId from "../components/forms/formsUser/NumeroId";
import WhatsAppPreview from "../components/preview/WhatsAppPreview";

import { getContentTemplates } from "../services/Twilio";
import { getCredencialById } from "../services/credentialService";
import { sendMassive } from "../services/massiveService";
import { obtenerSheetsPorCampaign } from "../services/sheet";
import { getTemplatesByCampaign } from "../services/templatesService";
import { obtenerNumerosPorSubcuenta } from "../services/numeroTelefonicoService";
import { obtenerCampanasPorSubcuenta } from "../services/campaignService";

interface Campaign {
  id: number;
  name: string;
  credential_template_id: number;
  spreadsheet_id: string;
  sheet_name: string;
}

interface Template {
  sid: string;
  friendly_name: string;
  body: string;
}

interface Number {
  id: number;
  nombre: string;
  number: number;
}

const Mesaje: React.FC = () => {
  const [numero, setNumero] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<
    number | null
  >(null);
  const [campañas, setCampañas] = useState<Campaign[]>([]);
  const [plantillas, setPlantillas] = useState<Template[]>([]);
  const [campañaSeleccionada, setCampañaSeleccionada] =
    useState<Campaign | null>(null);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<
    string | null
  >(null);

  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [numeros, setNumeros] = useState<Number[]>([]);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState<number | null>(
    null
  );
  const selectedTemplate = plantillas.find(
    (p) => p.sid === plantillaSeleccionada
  );
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [camposTemp, setCamposTemp] = useState<{ [key: string]: string }>({});
  const [sheetName, setSheetName] = useState<string | null>(null);
  const [loadingDatosCampaña, setLoadingDatosCampaña] = useState(false);
  const [loadingEnvioMensajes, setLoadingEnvioMensajes] = useState(false);

  const checkLocalStorage = () => {
    const savedCampaign = localStorage.getItem("selectedCampaign");
    const savedTemplate = localStorage.getItem("selectedTemplate");
    const savedRangeStart = localStorage.getItem("rangeStart");
    const savedRangeEnd = localStorage.getItem("rangeEnd");
    const savedNumber = localStorage.getItem("selectedNumber");

    console.log("Datos guardados en localStorage:");
    console.log(
      "Campaign:",
      savedCampaign ? JSON.parse(savedCampaign) : "No guardado"
    );
    console.log("Template:", savedTemplate || "No guardado");
    console.log("Range Start:", savedRangeStart || "No guardado");
    console.log("Range End:", savedRangeEnd || "No guardado");
    console.log("Number:", savedNumber || "No guardado");
  };

  // Cargar datos del localStorage al montar el componente
  useEffect(() => {
    const savedCampaign = localStorage.getItem("selectedCampaign");
    const savedTemplate = localStorage.getItem("selectedTemplate");
    const savedRangeStart = localStorage.getItem("rangeStart");
    const savedRangeEnd = localStorage.getItem("rangeEnd");
    const savedNumber = localStorage.getItem("selectedNumber");
  
    if (savedCampaign) {
      const parsedCampaign = JSON.parse(savedCampaign);
      handleCampaignChange(parsedCampaign); // 👈 IMPORTANTE
    }
  
    if (savedTemplate) setPlantillaSeleccionada(savedTemplate);
    if (savedRangeStart) setRangeStart(parseInt(savedRangeStart));
    if (savedRangeEnd) setRangeEnd(parseInt(savedRangeEnd));
    if (savedNumber) setNumeroSeleccionado(parseInt(savedNumber));
  
    // Verificar los datos cargados
    checkLocalStorage();
  }, []);

  useEffect(() => {
    const fetchCampañas = async () => {
      if (!subcuentaSeleccionada) return;
      try {
        const data = await obtenerCampanasPorSubcuenta(subcuentaSeleccionada);
        setCampañas(data);
        console.log("Campañas:", data);
      } catch (error) {
        console.error("Error al obtener campañas:", error);
      }
    };
    fetchCampañas();
  }, [subcuentaSeleccionada]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!campañaSeleccionada) return;

      try {
        // Obtenemos el credential_template_id de la campaña seleccionada
        const credentialTemplateId = campañaSeleccionada.credential_template_id;
        console.log("credential_template_id:", credentialTemplateId);

        // Primero, necesitamos obtener las credenciales usando credential_template_id
        const credentialDetails = await getCredencialById(credentialTemplateId);
        console.log("Credenciales obtenidas:", credentialDetails);

        // Ahora obtenemos el name de las credenciales
        const templateName = credentialDetails.name;

        if (!templateName) {
          console.error(
            "No se encontró el nombre de la plantilla en las credenciales"
          );
          return;
        }

        // Usamos el name para obtener las plantillas
        const data = await getContentTemplates(templateName);
        setPlantillas(data);

        console.log("Campaña:", campañaSeleccionada);
        console.log("Plantillas obtenidas con name:", data);
      } catch (error) {
        console.error("Error al obtener plantillas:", error);
        // Puedes manejar errores específicos aquí
      }
    };

    fetchTemplates();
  }, [campañaSeleccionada]);

  useEffect(() => {
    const fetchNumeros = async () => {
      if (!subcuentaSeleccionada) return;
      try {
        const data = await obtenerNumerosPorSubcuenta(subcuentaSeleccionada);
        setNumeros(data);
      } catch (error) {
        console.error("Error al obtener números:", error);
      }
    };
    fetchNumeros();
  }, [subcuentaSeleccionada]);

  // Guardar en localStorage cuando cambien los valores
  useEffect(() => {
    if (campañaSeleccionada) {
      localStorage.setItem(
        "selectedCampaign",
        JSON.stringify(campañaSeleccionada)
      );
    }
  }, [campañaSeleccionada]);

  useEffect(() => {
    if (plantillaSeleccionada) {
      localStorage.setItem("selectedTemplate", plantillaSeleccionada);
    }
  }, [plantillaSeleccionada]);

  useEffect(() => {
    if (rangeStart !== null) {
      localStorage.setItem("rangeStart", rangeStart.toString());
    }
  }, [rangeStart]);

  useEffect(() => {
    if (rangeEnd !== null) {
      localStorage.setItem("rangeEnd", rangeEnd.toString());
    }
  }, [rangeEnd]);

  useEffect(() => {
    if (numeroSeleccionado !== null) {
      localStorage.setItem("selectedNumber", numeroSeleccionado.toString());
    }
  }, [numeroSeleccionado]);

  //Función para obtener sid y campos de una plantilla
  const handleCampaignChange = async (campaign: Campaign) => {
    setCampañaSeleccionada(campaign);

    try {
      setLoadingDatosCampaña(true); // 🔥 Activamos loading

      const sheetInfo = await obtenerSheetsPorCampaign(campaign.id);
      console.log("📄 sheetInfo:", sheetInfo);

      if (sheetInfo && sheetInfo.sheet_id) {
        setSpreadsheetId(sheetInfo.sheet_id);
        console.log("📄 Spreadsheet ID cargado:", sheetInfo.sheet_id);
      } else {
        console.error("No se encontró sheet_id para esta campaña");
      }

      if (sheetInfo && sheetInfo.sheet_sheet) {
        setSheetName(sheetInfo.sheet_sheet); // NUEVO estado de sheetName
        console.log("📄 Sheet Name cargado:", sheetInfo.sheet_sheet);
      } else {
        console.error("No se encontró sheet_name para esta campaña");
      }

      const fieldsInfo = await getTemplatesByCampaign(campaign.id);
      if (fieldsInfo && fieldsInfo.associated_fields) {
        setCamposTemp(fieldsInfo.associated_fields);
        console.log(
          "🧩 Campos asociados cargados:",
          fieldsInfo.associated_fields
        );
      } else {
        console.error("No se encontraron campos asociados para esta campaña");
      }
    } catch (error) {
      console.error(
        "❌ Error en carga de datos adicionales para campaña:",
        error
      );
    } finally {
      setLoadingDatosCampaña(false); // 🔥 Desactivamos loading siempre
    }
  };

  const handleEnviar = async () => {
    try {
      console.log("spreadsheetId:", spreadsheetId);
      console.log("campañaSeleccionada:", campañaSeleccionada);

      if (!spreadsheetId || !sheetName || rangeStart === null || rangeEnd === null) {
        throw new Error("Datos incompletos: debes seleccionar un rango válido");
      }
      const requestBody = {
        spreadsheetId: spreadsheetId,
        sheetName: sheetName,
        rangeA: `A${rangeStart}`, 
        rangeB: `Z${rangeEnd}`,     
        templateBody: selectedTemplate?.body || '',
        camposTemp: camposTemp,
      };

      const response = await sendMassive(requestBody);
      console.log("✅ Envío exitoso:", response);
      alert("Mensajes enviados correctamente!");
    } catch (error) {
      console.error("❌ Error en el envío:", error);
      alert("Error al enviar los mensajes. Revisa la consola.");
    }
  };
  return (
    <div className={styles.layoutContainer}>
      {/* Columna izquierda */}
      <div className={styles.leftColumn}>
        <div className={styles.container}>
          <div className={styles.formContainer}>
            <div className={styles.header}>
              <div className={styles.textContent}>
                <div className={styles.titleRow}>
                  <FontAwesomeIcon
                    icon={faWhatsapp}
                    className={styles.whatsappIcon}
                  />
                  <h2 className="formTitle">Envío de mensajes Masivos</h2>
                </div>
                <p>
                  Envía mensajes masivos seleccionando una campaña, una
                  plantilla y un rango de mensajes.
                </p>
              </div>
              <div className={styles.selectorContainer}>
                <SubcuentaSelectorId
                  onSubcuentaChange={setSubcuentaSeleccionada}
                />
              </div>
            </div>
          </div>
          {loadingDatosCampaña && (
            <div className={styles.loadingContainer}>
              <p>Cargando datos de campaña...</p>
            </div>
          )}
          <div className={styles.formContainer}>
            <BuscarCampaignId
              Campaigns={campañas}
              onCampaignChange={handleCampaignChange} // <<< Aquí
              onCampaignsEncontradas={() => {}}
            />
          </div>
          <div className={styles.formContainer}>
            <TemplateSelectorId
              campañaSeleccionada={campañaSeleccionada?.id || null}
              Templates={plantillas}
              value={plantillaSeleccionada}
              onTemplateChange={(id) => setPlantillaSeleccionada(id)}
            />
          </div>
          <div className={styles.formContainer}>
            <DestinatariosId
              campañaSeleccionada={campañaSeleccionada?.id || null}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              setRangeStart={setRangeStart}
              setRangeEnd={setRangeEnd}
            />
          </div>
          <div className={styles.formContainer}>
            <NumeroSelectorId
              templates={plantillas}
              campañaSeleccionada={campañaSeleccionada?.id || null}
              numeros={numeros}
              selectedNumeroId={numeroSeleccionado}
              onNumeroChange={(id) => setNumeroSeleccionado(id)}
            />
          </div>
          <button onClick={handleEnviar} className={styles.button || "button"}>
            Enviar Mensajes
          </button>
        </div>
      </div>
      {/* Columna derecha */}
      <div className={styles.rightColumn}>
        <div className={styles.formContainer_preview}>
          <h3>Vista previa</h3>
          <WhatsAppPreview
            selectedTemplate={selectedTemplate}
            previewVariables={["Diego", "10:30 AM", "mañana"]}
            replaceVariables={(body, variables) =>
              typeof body === "string"
                ? body.replace(
                    /{{(\d+)}}/g,
                    (_, i) => variables[parseInt(i) - 1] || ""
                  )
                : ""
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Mesaje;
