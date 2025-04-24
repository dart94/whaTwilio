import React from "react";
import styles from "../../../styles/AsociarCredencialesView.module.css";

interface Campaign {
  ID: number;
  Nombre: string;
}

interface BuscarCampaignSelectorProps {
  Campaigns: Campaign[];
  onCampaignsEncontradas: (campaigns: Campaign[]) => void;
  onCampaignChange: (newValue: number) => void;
}

const BuscarCampaignId: React.FC<BuscarCampaignSelectorProps> = ({
  Campaigns,
  onCampaignChange,
  onCampaignsEncontradas,  // Asegúrate de incluir esta prop
}) => {
  const [selectedCampaign, setSelectedCampaign] = React.useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setSelectedCampaign(newValue);
    onCampaignChange(newValue);
  };

  return (
    <div className={styles.formGroup}>
      <div className={styles.stepHeader}>
        <div className={styles.stepNumber}>1</div>
        <h3 className={styles.title}>Campaña</h3>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Seleccionar Campaña:</label>
        <select
          className={styles.select}
          value={selectedCampaign}
          onChange={handleChange}
          disabled={Campaigns.length === 0}
        >
          <option value={0}>Seleccione una campaña</option>
          {Campaigns.map((campaign) => (
            <option key={campaign.ID} value={campaign.ID}>
              {campaign.Nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BuscarCampaignId;
