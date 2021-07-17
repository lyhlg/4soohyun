/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// import firebase from 'firebase'
import database from 'src/utils/config'

interface UserItem {
  startDate: Date | null
  endDate: Date | null
  duration: number | null
  amount: number | null
}

export const writeUserData = (
  userKey: string,
  { startDate, endDate, duration, amount }: UserItem,
): void => {
  database.ref(`users/${userKey}`).push({
    startDate: startDate ? startDate.toISOString() : new Date().toISOString(),
    endDate: endDate ? endDate.toISOString() : new Date().toISOString(),
    duration,
    amount,
  })
}

export const readUserDate = async (userKey: string): Promise<any> => {
  return await database
    .ref()
    .child('users')
    .child(userKey)
    .get()
    .then(snapshot => {
      if (snapshot.exists()) {
        const obj = snapshot.val()
        return Object.keys(obj).map(item => obj[item])
      } else {
        return []
      }
    })
}
