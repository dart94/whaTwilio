import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/Mesaje.module.css";
import SubcuentaSelectorId from "../components/forms/formsUser/SubcuentaSelectorId";
import BuscarCampaignId from "../components/forms/formsUser/BuscarCampaingId";
import { obtenerCampanasPorSubcuenta } from "../services/campaignService";
import { getTemplatesByCampaign } from "../services/templatesService";
import TemplateSelectorId from "../components/forms/formsUser/TemplateId";

interface Campaign {
  ID: number;
  Nombre: string;
}

interface Template {
  ID: number;
  Nombre: string;
}

const Mesaje: React.FC = () => {
  const [numero, setNumero] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [subcuentaSeleccionada, setSubcuentaSeleccionada] = useState<
    number | null
  >(null);
  const [campañas, setCampañas] = useState<Campaign[]>([]);
  const [plantillas, setPlantillas] = useState<Template[]>([]);
  const [campañaSeleccionada, setCampañaSeleccionada] = useState<number | null>(
    null
  );
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<
    number | null
  >(null);

  useEffect(() => {
    const fetchCampañas = async () => {
      if (!subcuentaSeleccionada) return;
      try {
        const data = await obtenerCampanasPorSubcuenta(subcuentaSeleccionada);
        setCampañas(data);
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
        const data = await getTemplatesByCampaign(campañaSeleccionada);
        setPlantillas(data);
      } catch (error) {
        console.error("Error al obtener plantillas:", error);
      }
    };

    fetchTemplates();
  }, [campañaSeleccionada]);

  const handleEnviar = () => {
    console.log("Número:", numero);
    console.log("Mensaje:", mensaje);
    console.log("Campaña:", campañaSeleccionada);
    // Aquí conectarías con Twilio u otro servicio
  };

  return (
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
              Envía mensajes masivos seleccionando una campaña, una plantilla y
              un rango de mensajes.
            </p>
          </div>
          <div className={styles.selectorContainer}>
            <SubcuentaSelectorId onSubcuentaChange={setSubcuentaSeleccionada} />
          </div>
        </div>
      </div>

      {/* Campaña */}
      <div className={styles.formContainer}>
        <BuscarCampaignId
          Campaigns={campañas}
          onCampaignChange={(id) => {
            setCampañaSeleccionada(id);
          }}
          onCampaignsEncontradas={() => {}}
        />
      </div>

      {/* Plantilla */}
      <div className={styles.formContainer}>
        <TemplateSelectorId
          Templates={plantillas}
          value={plantillaSeleccionada}
          onTemplateChange={(id) => {
            setPlantillaSeleccionada(id);
          }}
        />
      </div>
    </div>
  );
};

export default Mesaje;
