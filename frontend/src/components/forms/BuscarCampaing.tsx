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
  const [selectedCampaign, setSelectedCampaign] = React.useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setSelectedCampaign(newValue);
    onCampaignChange(newValue);
  };

  return (
    <div className={styles.formGroup}>
  <label className={styles.label}>Seleccionar Campaña:</label>
  <select 
    className={styles.select}
    value={selectedCampaign}
    onChange={handleChange}
  >
    <option value={0}>Seleccione una campaña</option>
    {Campaigns.map(campaign => (
      <option key={campaign.ID} value={campaign.ID}>
        {campaign.Nombre}
      </option>
    ))}
  </select>
</div>
  );
};

export default BuscarCampaign;
