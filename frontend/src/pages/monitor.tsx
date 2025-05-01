import React, { useState, useEffect } from "react";
import styles from "../styles/Mesaje.module.css";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { getTwilioLogs } from "../services/monitorTwilioService";
import { toast } from "react-toastify";

interface TwilioLog {
  sid: string;
  dateCreated: string;
  from: string;
  to: string;
  status: string;
  body?: string;
}

interface Props {
  accountSid: string;
  authToken: string;
}

interface MonitorProps {
  maxRows?: number;
}

const Monitor: React.FC<Props & MonitorProps> = ({ accountSid, authToken, maxRows }) => {
  const [logs, setLogs] = useState<TwilioLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const rowsToDisplay = maxRows ? logs.slice(0, maxRows) : logs;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getTwilioLogs(accountSid, authToken);
      console.log("🔥 Logs obtenidos:", data);
      console.log("🧾 Credenciales:", accountSid, authToken);
      setLogs(data);
    } catch (error) {
      console.error("Error fetching Twilio logs:", error);
      toast.error("No se pudieron cargar los logs de Twilio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accountSid || !authToken) return;
    fetchLogs();
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, [accountSid, authToken]);

  return (
    <div className={styles.contenedor}>
      <h2 className={styles.heading}>Logs de Twilio</h2>
      {loading ? (
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} /> Cargando logs...
        </div>
      ) : (
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {rowsToDisplay.map((log) => (
              <tr key={log.sid}>
                <td>{new Date(log.dateCreated).toLocaleString()}</td>
                <td>{log.to}</td>
                <td>
                  {log.status === "read" || log.status === "received" ? (
                    <FaCheckCircle className={styles.delivered} />
                  ) : (
                    <FaTimesCircle className={styles.failed} />
                  )} {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Monitor;
