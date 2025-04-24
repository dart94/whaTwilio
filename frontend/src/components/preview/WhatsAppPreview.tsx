import React from "react";
import styles from "../../styles/WhatsAppPreview.module.css";

interface Props {
  selectedTemplate?: { body: string };
  previewVariables: string[];
  replaceVariables: (text: string, variables: string[]) => string;
}

const WhatsAppPreview: React.FC<Props> = ({
  selectedTemplate,
  previewVariables,
  replaceVariables,
}) => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.phoneFrame}>
        <div className={styles.statusBar}></div>
        <div className={styles.navBar}>
          <div className={styles.backArrow}>←</div>
          <div className={styles.avatar}><span>B</span></div>
          <div className={styles.chatInfo}>
            <div className={styles.name}>Business</div>
            <div className={styles.status}>En línea</div>
          </div>
        </div>

        <div className={styles.chatArea}>
          <div className={styles.messageBubble}>Hola, ¿en qué puedo ayudarte?</div>
          {selectedTemplate && (
            <div className={styles.messageBubble}>
              {replaceVariables(selectedTemplate.body, previewVariables)}
            </div>
          )}
        </div>

        <div className={styles.inputBar}>
          <div className={styles.input}>Escribe un mensaje</div>
          <div className={styles.sendButton}>→</div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPreview;
