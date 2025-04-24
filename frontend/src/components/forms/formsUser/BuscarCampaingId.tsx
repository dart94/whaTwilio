import React from "react";
import styles from "../../../styles/AsociarCredencialesView.module.css";

interface Campaign {
  id: number;
  name: string;
  credential_template_id: number;
}

interface BuscarCampaignSelectorProps {
  Campaigns: Campaign[];
  onCampaignsEncontradas: (campaigns: Campaign[]) => void;
  onCampaignChange: (campaign: Campaign | null) => void;
}

const BuscarCampaignId: React.FC<BuscarCampaignSelectorProps> = ({
  Campaigns,
  onCampaignChange,
  onCampaignsEncontradas, // Asegúrate de incluir esta prop
}) => {
  const [selectedCampaign, setSelectedCampaign] = React.useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = Number(e.target.value);
    setSelectedCampaign(newValue);

    const selected = Campaigns.find((c) => c.id === newValue) || null;
    onCampaignChange(selected);
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
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BuscarCampaignId;
