import {
  collection,
  getDocs,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore'
import { getBase64FromUrl } from '.'
import { firebaseDb } from '../firebaseConfig'
import { Storage } from '@capacitor/storage'
import Resizer from 'react-image-file-resizer'

//code to fetch the userID
export const fetchUser = async (
  studentId: string,
  successCallback: (user: any) => {},
  failureCallback: () => void,
) => {
  try {
    const studentRef = collection(firebaseDb, 'students')
    const studentQuery = query(studentRef, where('sid', '==', studentId))
    const unsubscribe = onSnapshot(studentQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        failureCallback()
      } else {
        querySnapshot.forEach(async (doc) => {
          const student = doc.data()
          if (student.sid) {
            successCallback(student.sid)
          }
        })
      }
    })
    return unsubscribe
  } catch (e) {
    console.error(e)
  }
  return null
}

//function to resize the image data to store it into local storage
const resizeFile = (file: Blob) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      'WEBP',
      100,
      0,
      (uri: any) => {
        resolve(uri)
      },
      'base64',
    )
  })

//function to fetch csreen data from the firebase
export const fetchScreens = async (
  userID: string | null,
  callback: (screens: any[]) => {},
) => {
  const studentsRef = collection(firebaseDb, 'students')
  const screensRef = collection(firebaseDb, 'screens')
  const buttonsRef = collection(firebaseDb, 'buttons')

  try {
    const studentsQuery = query(studentsRef, where('sid', '==', userID))
    const unsubscribe = onSnapshot(studentsQuery, (querySnapshot) => {
      const screens: any[] = []
      querySnapshot.forEach(async (doc) => {
        const students = doc.data()
        const screenKeys = ['screen1', 'screen2', 'screen3']
        for (const screenKey of screenKeys) {
          if (students[screenKey]) {
            const screensQuery = query(
              screensRef,
              where('sname', '==', students[screenKey]),
            )
            try {
              const screensDoc = await getDocs(screensQuery)
              const screenData = screensDoc.docs[0].data()
              const _screenData: any = {
                rows: screenData.r,
                columns: screenData.c,
                title: screenData.sname,
                buttons: [],
              }
              const buttons = screenData.buttonsSelected
              for (const button of buttons) {
                if (button) {
                  const buttonsQuery = query(
                    buttonsRef,
                    where('name', '==', button),
                  )
                  try {
                    const buttonsDoc = await getDocs(buttonsQuery)
                    const buttonData = buttonsDoc.docs[0].data()
                    const _buttonData = {
                      text: buttonData.name,
                      color: buttonData.color,
                    }
                    try {
                      const imageBlob = await getBase64FromUrl(
                        buttonData.image_url,
                      )
                      const img = await resizeFile(imageBlob as Blob)
                      await Storage.set({
                        key: buttonData.name,
                        value: img as string,
                      })
                    } catch (e) {
                      console.error(e)
                    }
                    _screenData.buttons.push(_buttonData)
                  } catch (e) {}
                }
              }
              screens.push(_screenData)
            } catch (e) {}
          }
        }
        // return screens
        callback(screens)
      })
    })
    return unsubscribe
  } catch (e) {}
  return null
}
