import { IonIcon } from "@ionic/react";
import { sadOutline } from "ionicons/icons";
import "./NoButtons.css";

//React component for a case when no buttons are assigned to a screen
const NoButtons: React.FC = () => {
  return (
    <div className="nobutton-container">
      <IonIcon icon={sadOutline} className="nobutton-icon"/>
      <p>No Buttons Present</p>
    </div>
  );
};

export default NoButtons;
