import React, { useState, useEffect } from "react";
import styles from "../styles/Mesaje.module.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";
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

const Monitor: React.FC<Props & MonitorProps> = ({
  accountSid,
  authToken,
  maxRows,
}) => {
  const [logs, setLogs] = useState<TwilioLog[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const rowsPerPage = maxRows || 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(logs.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const paginatedLogs = logs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

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

  

  const renderStatusIcon = (status) => {
    switch (status) {
      case "read":
      case "received":
        return <FaCheckCircle className={styles.delivered} />;
      case "undelivered":
        return <FaExclamationCircle className={styles.undelivered} />;
      case "failed":
        return <FaTimesCircle className={styles.failed} />;
      case "queued":
      case "sending":
        return <FaClock className={styles.pending} />;
      default:
        return <FaClock className={styles.unknown} />;
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
      <div>
        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log.sid}>
                <td>{new Date(log.dateCreated).toLocaleString()}</td>
                <td>{log.to}</td>
                <td>
                  {renderStatusIcon(log.status)} {log.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Anterior
          </button>
          <span>Página {currentPage} de {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Siguiente
          </button>
        </div>
      </div>
        
      )}
    </div>
  );
};

export default Monitor;
