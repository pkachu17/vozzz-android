import { Storage } from '@capacitor/storage'
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/react'
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { checkLogin } from '../utils'
import { fetchUser } from '../utils/firebase'
import './Login.css'

//Login page react component
const Login: React.FC = () => {
  const [studentId, setStudentId] = useState('')
  const [fetching, setFetching] = useState(false)
  const [fetch, setFetch] = useState(false)
  const history = useHistory()

  // to fetch the userID and to store it in local storage
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUser = async (studentId: any) => {
    try {
      const unsub = await fetchUser(
        studentId,
        async (userID) => {
          if (userID) {
            setFetching(true)
            await Storage.set({ key: 'userID', value: userID })
            setStudentId('')
            if (!history.location.pathname.includes('/user')) {

              history.push('/user')
            }
          } else {
            alert('User does not exist')
          }
          setFetching(false)
        },
        () => {
          alert('User does not exist')
        },
      )
      return unsub
    } catch (e) {}
  }

  // to check if the user has already logged in
  useEffect(() => {
    const loginCheck = async () => {
      const userID = await checkLogin()
      if (userID) {
        history.replace('/user')
      }
    }
    loginCheck()
  }, [])

  useEffect(() => {
    let unsub: any
    const get = async () => {
      try {
        if (fetch) {
          unsub = await getUser(studentId)
        }
      } catch (e) {}
    }
    if (fetch) {
      get()
      setFetch(false)
    }
    return () => {
      if (unsub) {
        unsub()
      }
    }
  }, [fetch])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="login-container">
          <IonItem>
            <IonLabel>Student ID</IonLabel>
            <IonInput
              inputMode="numeric"
              type="number"
              placeholder="Enter StudentID"
              value={studentId}
              onIonChange={(e: any) => setStudentId(e.target.value)}
            ></IonInput>
          </IonItem>
          <IonButton
            color="primary"
            onClick={() => !fetching && setFetch(true)}
          >
            {fetching ? <IonSpinner /> : 'Submit'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  )
}
export default Login
