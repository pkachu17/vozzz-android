import { IonCol, IonContent, IonGrid, IonPage, IonRow } from "@ionic/react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { checkLogin, textToSpeech } from "../utils";
import NoButtons from "./NoButtons";
import "./ScreenLayout.css";
interface ComponentProps {
  screenData: any;
}
//------------------------------------------------------------------------------------------------   
// The below code is to store the button history in the local cache online
var indexedArray: { [key: string]: number } = {}

const ExploreContainer: React.FC<ComponentProps> = ({ screenData }) => {
  const addDataIntoCache   = (screencache: any, url: any, indexedArray: any) => {     
    const data = new Response(JSON.stringify(indexedArray));
    if ('caches' in window) {
      caches.open(screencache).then((cache) => {
        cache.put(url, data);
      });
    }
  };
  const cacheToFetch = { cacheName: 'screencache', url: 'https://localhost:8100' }
  const getSingleCacheData = async (cacheName: any, url: any, sid: any) => {

    if (typeof caches === 'undefined') return false;

    const cacheStorage = await caches.open(cacheName);
    const cachedResponse = await cacheStorage.match(url);

    if (!cachedResponse || !cachedResponse.ok) {
      return false
    }

    return cachedResponse.json().then(async (item) => {
      let Buttons = []
      let Count = []

      for (let key in item) {
        Buttons.push(key)
        Count.push(item[key])
      }
      
//The below code is to store the button history data from cache to firebase ie db.
      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "analytics", sid), {
          sid,
          Buttons, Count
        });
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
    });
  };
//----------------------------------------------------------------------------------------------------------
  return (
    <IonPage>
      <IonContent fullscreen>
        {screenData?.buttons?.length ? (<IonGrid>
          <IonRow>
            {screenData.buttons?.map((button: any, index: number) => (
              <IonCol size={(12 / +screenData.columns).toString()} key={`${button.text}${index}`}>
                <button
                  className="screen-layout-button"
                  style={{ backgroundColor: `${button.color}` }}
                  onClick={async(e) => {
                    await caches.has('screencache').then(function(hasCache) {
                      if (!hasCache) {
                        indexedArray = {}
                        console.log("cleared array", indexedArray)
                      } 
                    }).catch(function() {
                    });
                    console.log("online status", navigator.onLine)
                    if (navigator.onLine){
                      const userID = await checkLogin();
                      getSingleCacheData(cacheToFetch.cacheName, cacheToFetch.url, userID)
                    }
                      
                    indexedArray[button.text] = (indexedArray[button.text] || 0) + 1;
                    console.log("storing data", indexedArray)
                    textToSpeech(button.text); 
                    addDataIntoCache('screencache','https://localhost:8100', indexedArray)
                  }}
                >
                  <img className="screen-layout-button-image" src={button.img} alt="button-img" />
                  <h3 className="screen-layout-button-text">{button.text}</h3>
                </button>
              </IonCol>
            ))}
            
          </IonRow>
        </IonGrid>) : <NoButtons />}
      </IonContent>
    </IonPage>
  );
};

export default ExploreContainer;