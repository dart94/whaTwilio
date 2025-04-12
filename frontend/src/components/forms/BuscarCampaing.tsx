import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { obtenerCampanas } from '../../services/campaignService';
import styles from '../../styles/AsociarCredencialesView.module.css';

interface Campaign {
  ID: number;
  Nombre: string;
  
}

interface BuscarCampaignSelectorProps {
  onCampaignsEncontradas: (campaigns: Campaign[]) => void;
  onCampaignChange: (newValue: number) => void;
}

const BuscarCampaign: React.FC<BuscarCampaignSelectorProps> = ({
  onCampaignsEncontradas,
  onCampaignChange,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<number>(0);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const data = await obtenerCampanas();
        setCampaigns(data);
        onCampaignsEncontradas(data);
      } catch (error) {
        console.error("Error al obtener campañas:", error);
        toast.error("Error al obtener campañas");
      }
    };
    fetchCampaigns();
  }, [onCampaignsEncontradas]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setSelectedCampaign(newValue);
    onCampaignChange(newValue);
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Campaña</label>
      <select
        value={selectedCampaign}
        onChange={handleChange}
        className={styles.select}
        disabled={campaigns.length === 0}
      >
        <option value={0} className={styles.option}>
          Seleccionar campaña
        </option>
        {campaigns.map((campaign) => (
          <option key={campaign.ID} value={campaign.ID} className={styles.option}>
            {campaign.Nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BuscarCampaign;
