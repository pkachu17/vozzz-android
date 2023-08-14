import {
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonRouterOutlet,
  IonSpinner,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { Redirect, Route, useHistory } from 'react-router'
import ScreenLayout from '../components/ScreenLayout'
import { fetchScreens } from '../utils/firebase'
import { Storage } from '@capacitor/storage'
import SideButton from '../components/logout/SideButton'
import { checkLogin } from '../utils'
import './User.css'

const User: React.FC = () => {
  const history = useHistory()

  const [userScreens, setUserScreens] = useState<any[] | []>([])

  useEffect(() => {
    let unsub: any
    const functions = async () => {
      await loginCheck()
      await loadScreens()
      unsub = await getScreens()
    }
    functions()

    return () => {
      if (unsub) {
        unsub()
      }
    }
  }, [])

  useEffect(() => {
    const currentScreen = history.location.pathname.replace('/user/', '')
    if (!userScreens?.find((screen) => screen.title === currentScreen) && userScreens?.length) {
      history.replace('/user/' + userScreens[0].title)
    }
  }, [userScreens])

  //to check if the user has already logged in
  const loginCheck = async () => {
    const userID = await checkLogin()
    if (!userID) {
      history.replace('/login')
    }
  }

  //to load all screens from local storage
  const loadScreens = async () => {
    let screens = []
    try {
      const screenStorage = await Storage.get({
        key: 'screens',
      })
      screens = JSON.parse(screenStorage.value || '[]')
    } catch (e) {}
    await setBase64Images(screens)
    setUserScreens(screens)
  }

  //to fetch all the screens and screen data from the database based on the userID in the local storage
  const getScreens = async () => {
    const { value: userID } = await Storage.get({
      key: 'userID',
    })
    const unsub = await fetchScreens(userID, async (screens) => {
      await Storage.set({
        key: 'screens',
        value: JSON.stringify(screens),
      })
      await setBase64Images(screens)
      setUserScreens(screens)
    })
    return unsub
  }

  //get base64Images from the local storage
  const setBase64Images = async (screens: any[]) => {
    for (const screen of screens) {
      for (const button of screen.buttons) {
        let value
        try {
          value = (await Storage.get({ key: button.text })).value
        } catch (e) {}
        button.img = value
      }
    }
  }

  //to display the screen data using screen layout and the below navigation bar
  return userScreens?.length ? (
    <>
      <IonTabs>
        <IonRouterOutlet>
          <Redirect exact path="/user" to={`/user/${userScreens[0].title}`} />
          {userScreens?.map((userScreen) => (
            <Route
              key={userScreen.title}
              path={`/user/${userScreen.title}`}
              render={() => <ScreenLayout screenData={userScreen} />}
              exact={true}
            />
          ))}
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          {userScreens?.map((userScreen) => (
            <IonTabButton
              tab={userScreen.title}
              href={`/user/${userScreen.title}`}
              key={userScreen.title}
            >
              <IonIcon icon={require('ionicons/icons')['folder']} />
              <IonLabel>{userScreen.title}</IonLabel>
            </IonTabButton>
          ))}
        </IonTabBar>
      </IonTabs>
      <SideButton />
    </>
  ) : (
    <IonPage>
      <IonContent>
        <div className="loading-container">
          <IonSpinner name="bubbles" />
        </div>
      </IonContent>
    </IonPage>
  )
}

export default User
