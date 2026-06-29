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
import Monitor from "../pages/monitor";

import { getContentTemplates } from "../services/Twilio";
import { getCredencialById } from "../services/credentialService";
import { sendMassive, getMassiveStatus, JobStatus } from "../services/massiveService";
import { obtenerSheetsPorCampaign } from "../services/sheet";
import { getTemplatesByCampaign } from "../services/templatesService";
import { obtenerNumerosPorSubcuenta } from "../services/numeroTelefonicoService";
import { obtenerCampanasPorSubcuenta } from "../services/campaignService";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Campaign {
  id: number;
  name: string;
  credential_template_id: number;
  spreadsheet_id?: string;
  sheet_name?: string;
  associated_fields?: { [key: string]: string };
}

interface Template {
  sid: string;
  friendly_name: string;
  body: string;
}

interface Number {
  id: number;
  nombre: string;
  numero: string;
}

interface TwilioCredential {
  id: number;
  name: string;
  account_sid: string;
  auth_token: string;
  whatsapp_number: string;
  messagingServiceSid?: string;
}

const Mesaje: React.FC = () => {
  const navigate = useNavigate();
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
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [sheetName, setSheetName] = useState<string | null>(null);
  const [loadingDatosCampaña, setLoadingDatosCampaña] = useState(false);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [credencialSeleccionada, setCredencialSeleccionada] =
    useState<TwilioCredential | null>(null);
  const [mostrarTodo, setMostrarTodo] = useState(false);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const pollRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const selectedTemplate = plantillas.find(
    (p) => p.sid === plantillaSeleccionada
  );
  const [enviando, setEnviando] = useState(false);

  // useEffect(() => {
  //   const user = JSON.parse(localStorage.getItem("user") || "{}");

  //   if (!user || user.is_staff === 0) {
  //     navigate("/login"); // o redirige al login
  //   }
  // }, []);

  // Calcula el progreso del formulario
  const calculateProgress = () => {
    let completedSteps = 0;
    const totalSteps = 5;
    if (subcuentaSeleccionada != null) completedSteps++;
    if (campañaSeleccionada != null) completedSteps++;
    if (plantillaSeleccionada) completedSteps++;
    if (rangeStart != null && rangeEnd != null) completedSteps++;
    if (numeroSeleccionado != null) completedSteps++;
    return Math.round((completedSteps / totalSteps) * 100);
  };

  // Recalcula progreso en cambios
  useEffect(() => {
    setProgressPercentage(calculateProgress());
  }, [
    subcuentaSeleccionada,
    campañaSeleccionada,
    plantillaSeleccionada,
    rangeStart,
    rangeEnd,
    numeroSeleccionado,
  ]);

  // Persistir subcuenta en localStorage
  useEffect(() => {
    if (subcuentaSeleccionada != null) {
      localStorage.setItem(
        "selectedSubcuenta",
        subcuentaSeleccionada.toString()
      );
    } else {
      localStorage.removeItem("selectedSubcuenta");
    }
  }, [subcuentaSeleccionada]);

  // Guardar otros campos en localStorage
  useEffect(() => {
    if (campañaSeleccionada)
      localStorage.setItem(
        "selectedCampaign",
        JSON.stringify(campañaSeleccionada)
      );
    else localStorage.removeItem("selectedCampaign");
  }, [campañaSeleccionada]);

  useEffect(() => {
    if (plantillaSeleccionada)
      localStorage.setItem("selectedTemplate", plantillaSeleccionada);
    else localStorage.removeItem("selectedTemplate");
  }, [plantillaSeleccionada]);

  useEffect(() => {
    if (rangeStart != null)
      localStorage.setItem("rangeStart", rangeStart.toString());
    else localStorage.removeItem("rangeStart");
  }, [rangeStart]);

  useEffect(() => {
    if (rangeEnd != null) localStorage.setItem("rangeEnd", rangeEnd.toString());
    else localStorage.removeItem("rangeEnd");
  }, [rangeEnd]);

  useEffect(() => {
    if (numeroSeleccionado != null)
      localStorage.setItem("selectedNumber", numeroSeleccionado.toString());
    else localStorage.removeItem("selectedNumber");
  }, [numeroSeleccionado]);

  // Cargar datos de localStorage al montar
  useEffect(() => {
    const lsSub = localStorage.getItem("selectedSubcuenta");
    if (lsSub) setSubcuentaSeleccionada(parseInt(lsSub, 10));

    const savedCampaign = localStorage.getItem("selectedCampaign");
    if (savedCampaign) handleCampaignChange(JSON.parse(savedCampaign));

    const savedTpl = localStorage.getItem("selectedTemplate");
    if (savedTpl) setPlantillaSeleccionada(savedTpl);

    const savedStart = localStorage.getItem("rangeStart");
    if (savedStart) setRangeStart(parseInt(savedStart, 10));

    const savedEnd = localStorage.getItem("rangeEnd");
    if (savedEnd) setRangeEnd(parseInt(savedEnd, 10));

    const savedNum = localStorage.getItem("selectedNumber");
    if (savedNum) setNumeroSeleccionado(parseInt(savedNum, 10));
  }, []);

  // Fetch campañas cuando cambia subcuenta
  useEffect(() => {
    if (!subcuentaSeleccionada) return;
    obtenerCampanasPorSubcuenta(subcuentaSeleccionada)
      .then(setCampañas)
      .catch(console.error);
  }, [subcuentaSeleccionada]);

  // Fetch plantillas cuando cambia campaña
  useEffect(() => {
    if (!campañaSeleccionada) return;
    (async () => {
      setLoadingDatosCampaña(true);
      try {
        const cred = await getCredencialById(
          campañaSeleccionada.credential_template_id
        );
        const credTransformada: TwilioCredential = {
          id: cred.id,
          name: cred.name,
          account_sid: cred.json.account_sid,
          auth_token: cred.json.auth_token,
          whatsapp_number: cred.json.whatsapp_number,
        };

        setCredencialSeleccionada(credTransformada);
        const templates = await getContentTemplates(cred.name);
        setPlantillas(templates);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingDatosCampaña(false);
      }
    })();
  }, [campañaSeleccionada]);

  // Fetch números cuando cambia subcuenta
  useEffect(() => {
    if (!subcuentaSeleccionada) return;
    obtenerNumerosPorSubcuenta(subcuentaSeleccionada)
      .then(setNumeros)
      .catch(console.error);
  }, [subcuentaSeleccionada]);

  // Manejar cambio de campaña (incluye sheets y campos)
  const handleCampaignChange = async (campaign: Campaign | null) => {
    if (!campaign) {
      setCampañaSeleccionada(null);
      return;
    }
    setLoadingDatosCampaña(true);
    try {
      const sheetInfo = await obtenerSheetsPorCampaign(campaign.id);
      const fieldsInfo = await getTemplatesByCampaign(campaign.id);
      const updated: Campaign = {
        ...campaign,
        spreadsheet_id: sheetInfo.sheet_id || "",
        sheet_name: sheetInfo.sheet_sheet || "",
        associated_fields: fieldsInfo.associated_fields || {},
      };
      setCampañaSeleccionada(updated);
      if (sheetInfo.sheet_id) setSpreadsheetId(sheetInfo.sheet_id);
      if (sheetInfo.sheet_sheet) setSheetName(sheetInfo.sheet_sheet);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDatosCampaña(false);
    }
  };

  //Resetear formulario
  const resetFormulario = () => {
    setSubcuentaSeleccionada(null);
    setCampañaSeleccionada(null);

    setPlantillaSeleccionada(null); // esto hace que selectedTemplate sea undefined
    // setPlantillas([]); // opcional: solo si quieres vaciar lista
    // setCampañas([]);   // opcional

    setRangeStart(null);
    setRangeEnd(null);

    setNumeroSeleccionado(null);
    // setNumeros([]); // opcional

    setSpreadsheetId(null);
    setSheetName(null);

    setCredencialSeleccionada(null);
    setMostrarTodo(false);

    setProgressPercentage(0); // 🔥 obliga a completar pasos otra vez
  };

  // Limpia el intervalo de polling al desmontar
  React.useEffect(() => {
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  // Envío masivo
  const handleEnviar = async () => {
    if (!spreadsheetId || !sheetName || rangeStart == null || rangeEnd == null) {
      toast.error("Datos incompletos"); return;
    }
    if (rangeStart < 1) { toast.error("El rango inicial debe ser mayor a 0."); return; }
    if (rangeEnd < rangeStart) { toast.error("El rango final debe ser mayor o igual al inicial."); return; }
    if (!credencialSeleccionada) { toast.error("Faltan las credenciales de Twilio para esta campaña."); return; }
    const sender = numeros.find((n) => n.id === numeroSeleccionado);
    if (!sender?.numero) { toast.error("Número de envío no encontrado o inválido."); return; }
    if (!selectedTemplate?.sid) { toast.error("No se ha seleccionado una plantilla válida."); return; }

    setEnviando(true);
    setJobStatus(null);

    try {
      const { jobId } = await sendMassive({
        spreadsheetId,
        sheetName,
        rangeA: `A${rangeStart}`,
        rangeB: `Z${rangeEnd}`,
        templateSid: selectedTemplate.sid,
        camposTemp: campañaSeleccionada?.associated_fields || {},
        twilioAccountSid: credencialSeleccionada.account_sid,
        twilioAuthToken: credencialSeleccionada.auth_token,
        twilioSenderNumber: `whatsapp:+521${sender.numero}`,
      });

      toast.info("Envío iniciado — actualizando progreso...");

      pollRef.current = setInterval(async () => {
        try {
          const status = await getMassiveStatus(jobId);
          setJobStatus(status);
          if (status.status === 'done' || status.status === 'error') {
            clearInterval(pollRef.current!);
            pollRef.current = null;
            setEnviando(false);
            if (status.status === 'done') {
              toast.success(`Completado: ${status.sent} enviados, ${status.errors} errores`);
              resetFormulario();
              setJobStatus(null);
            } else {
              toast.error(`Error en el envío: ${status.message || 'Error desconocido'}`);
            }
          }
        } catch {
          clearInterval(pollRef.current!);
          pollRef.current = null;
          setEnviando(false);
        }
      }, 3000);

    } catch (e: any) {
      toast.error(e?.message || "Error al iniciar el envío.");
      setEnviando(false);
    }
  };

  // Pasos del formulario
  const formSteps = [
    { name: "Subcuenta", completed: subcuentaSeleccionada != null },
    { name: "Campaña", completed: campañaSeleccionada != null },
    { name: "Plantilla", completed: !!plantillaSeleccionada },
    {
      name: "Destinatarios",
      completed: rangeStart != null && rangeEnd != null,
    },
    { name: "Número", completed: numeroSeleccionado != null },
  ];

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.topRow}>
        {/* Izquierda */}
        <div className={styles.leftColumn}>
          <div className={styles.container}>
            <div className={styles.progressContainer}>
              <div className={styles.progressInfo}>
                <span className={styles.progressText}>
                  Progreso: {progressPercentage}%
                </span>
              </div>
              <div className={styles.progressBarOuter}>
                <div
                  className={styles.progressBarInner}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className={styles.progressStepsContainer}>
                {formSteps.map((step, idx) => (
                  <div key={idx} className={styles.progressStep}>
                    <div
                      className={`${styles.stepIndicator} ${
                        step.completed ? styles.completed : ""
                      }`}
                    >
                      {step.completed && (
                        <FaCheckCircle className={styles.checkIcon} />
                      )}
                    </div>
                    <span className={styles.stepName}>{step.name}</span>
                  </div>
                ))}
              </div>
            </div>

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
                    Envía mensajes masivos seleccionando campaña, plantilla y
                    rango.
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
                <div className={styles.spinner}></div>
                Cargando datos de campaña...
              </div>
            )}

            <div className={styles.formContainer}>
              <BuscarCampaignId
                Campaigns={campañas}
                onCampaignChange={(c) => {
                  void handleCampaignChange(c);
                }}
                onCampaignsEncontradas={() => {}}
              />
            </div>
            <div className={styles.formContainer}>
              <TemplateSelectorId
                campañaSeleccionada={campañaSeleccionada?.id || null}
                Templates={plantillas}
                value={plantillaSeleccionada}
                onTemplateChange={setPlantillaSeleccionada}
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
                onNumeroChange={setNumeroSeleccionado}
              />
            </div>

            <button
              onClick={handleEnviar}
              className={`${styles.submitButton} ${
                progressPercentage === 100 ? styles.buttonReady : ""
              }`}
              disabled={enviando || progressPercentage !== 100}

            >
              {enviando
                ? <><FaSpinner className={styles.spinnerIcon} /> {jobStatus ? `Enviando ${jobStatus.processed}/${jobStatus.total}...` : "Iniciando..."}</>
                : progressPercentage === 100
                ? "Enviar Mensajes"
                : `Complete los pasos (${progressPercentage}%)`}
            </button>
          </div>
        </div>

        {/* Derecha */}
        <div className={styles.rightColumn}>
          <div className={styles.formContainer_preview}>
            <h3>Vista previa</h3>
            <WhatsAppPreview
              selectedTemplate={selectedTemplate}
              previewVariables={["Variable 1", "Variable 2", "Variable 3"]}
              replaceVariables={(body, vars) =>
                typeof body === "string"
                  ? body.replace(/{{(\d+)}}/g, (_, i) => vars[+i - 1] || "")
                  : ""
              }
            />
          </div>
        </div>
      </div>
      <div className={styles.bottomRow}>
        <div className={styles.formContainer2}>
          <button
            className={styles.fullLogButton}
            onClick={() => setMostrarTodo(!mostrarTodo)}
            disabled={!credencialSeleccionada}
          >
            {mostrarTodo ? "Ver menos" : "Ver todo el historial"}
          </button>
          <h3>Historial de envíos</h3>
          {credencialSeleccionada && (
            <Monitor
              accountSid={credencialSeleccionada.account_sid}
              authToken={credencialSeleccionada.auth_token}
              maxRows={mostrarTodo ? undefined : 20} // Mostrar todas las filas si mostrarTodo es true
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Mesaje;
