import React from 'react';
import styles from '../../styles/AsociarCredencialesView.module.css';

interface Campaign {
  ID: number;
  Nombre: string;
}

interface BuscarCampaignSelectorProps {
  Campaigns: Campaign[];
  onCampaignsEncontradas: (campaigns: Campaign[]) => void;
  onCampaignChange: (newValue: number) => void;
}

const BuscarCampaign: React.FC<BuscarCampaignSelectorProps> = ({
  Campaigns,
  onCampaignsEncontradas, // <- puedes quitarlo si ya no lo usas
  onCampaignChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    onCampaignChange(newValue);
  };

  return (
    <div className={styles.fieldGroup}>
      <label className={styles.label}>Campaña</label>
      <select
        value={Campaigns.length === 0 ? 0 : undefined}
        onChange={handleChange}
        className={styles.select}
        disabled={Campaigns.length === 0}
      >
        <option value={0} className={styles.option}>
          Seleccionar campaña
        </option>
        {Campaigns.map((campaign) => (
          <option key={campaign.ID} value={campaign.ID} className={styles.option}>
            {campaign.Nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BuscarCampaign;
