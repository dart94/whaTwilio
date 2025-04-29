import React, { useState, useEffect } from "react";
import styles from "../styles/Mesaje.module.css";
import { FaSpinner, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { getTwilioLogs } from "../services/twilioService";
import { toast } from "react-toastify";

interface TwilioLog {
  sid: string;
  dateCreated: string;
  from: string;
  to: string;
  status: string;
  body?: string;
}

const Monitor: React.FC = () => {
  const [logs, setLogs] = useState<TwilioLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getTwilioLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching Twilio logs:", error);
      toast.error("No se pudieron cargar los logs de Twilio.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    // Optionally, poll every minute
    const interval = setInterval(fetchLogs, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Logs de Twilio</h2>
      {loading ? (
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} /> Cargando logs...
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>SID</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
              <th>Mensaje</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.sid}>
                <td>{new Date(log.dateCreated).toLocaleString()}</td>
                <td>{log.sid}</td>
                <td>{log.from}</td>
                <td>{log.to}</td>
                <td>
                  {log.status === "delivered" ? (
                    <FaCheckCircle className={styles.delivered} />
                  ) : (
                    <FaTimesCircle className={styles.failed} />
                  )}{" "}{log.status}
                </td>
                <td>{log.body || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Monitor;
