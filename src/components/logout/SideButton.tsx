import { Storage } from "@capacitor/storage";
import {
  IonContent,
  IonIcon, useIonPopover
} from "@ionic/react";
import { power } from "ionicons/icons";
import * as React from 'react';
import { FC } from "react";
import { useHistory } from "react-router";
import "./SideButton.css";

//Popover for log-out functionality
const Popover: FC<{ logout: any }> = ({ logout }) => {
  return (
    <IonContent class="ion-padding" onClick={logout}>
      Logout
    </IonContent>
  );
};
// the below code is to clear the cache upon login to the application
const SideButton: React.FC = () => {
  const history = useHistory();
  const [cacheData, setCacheData] = React.useState();

  const clearCacheData = () => {
    caches.keys().then((names) => {
      names.forEach((name) => {
        caches.delete(name);
      });
    });
    Storage.clear();
  };
  const logout = async () => {
    clearCacheData();
    dismiss();
    await Storage.clear();
    history.replace("/login");
  };
  const [present, dismiss] = useIonPopover(Popover, {
    logout,
  });

//Logout button on the side
  return (
    <div
      className="sidebutton-container"
      onClick={(e: any) =>
        present({
          event: e,
        })
      }
    >
      <IonIcon icon={power} className="sidebutton-icon" />
    </div>
  );
};

export default SideButton;