import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styles from "../styles/Mesaje.module.css";
import SubcuentaSelectorId from "../components/forms/formsUser/SubcuentaSelectorId";
import BuscarCampaignId from "../components/forms/formsUser/BuscarCampaingId";
import { obtenerCampanasPorSubcuenta } from "../services/campaignService";
import { getTemplatesByCampaign } from "../services/templatesService";
import { obtenerNumerosPorSubcuenta } from "../services/numeroTelefonicoService";
import DestinatariosId from "../components/forms/formsUser/DestinatariosId";
import TemplateSelectorId from "../components/forms/formsUser/TemplateId";
import NumeroSelectorId from "../components/forms/formsUser/NumeroId";

interface Campaign {
  ID: number;
  Nombre: string;
}

interface Template {
  ID: number;
  Nombre: string;
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
  const [campañaSeleccionada, setCampañaSeleccionada] = useState<number | null>(
    null
  );
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<
    number | null
  >(null);
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeEnd, setRangeEnd] = useState<number | null>(null);
  const [numeros, setNumeros] = useState<Number[]>([]);
  const [numeroSeleccionado, setNumeroSeleccionado] = useState<number | null>(null);

  //Función para obtener las campañas por subcuenta
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

  //Función para obtener las plantillas por campaña
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

  //Función para obtener los números por subcuenta
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
          campañaSeleccionada={campañaSeleccionada}
          Templates={plantillas}
          value={plantillaSeleccionada}
          onTemplateChange={(id) => {
            setPlantillaSeleccionada(id);
          }}
        />
      </div>

      {/* Destinatarios */}
      <div className={styles.formContainer}>
        <DestinatariosId
          campañaSeleccionada={campañaSeleccionada}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          setRangeStart={setRangeStart}
          setRangeEnd={setRangeEnd}
        />
      </div>

      {/* Números */}
      <div className={styles.formContainer}>
        <NumeroSelectorId
          templates={plantillas}
          campañaSeleccionada={campañaSeleccionada}
          numeros={numeros}
          selectedNumeroId={numeroSeleccionado}
          onNumeroChange={(id) => setNumeroSeleccionado(id)}
        />
      </div>
    </div>
  );
};

export default Mesaje;
