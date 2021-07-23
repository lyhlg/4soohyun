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

interface UserItemV2 {
  startDate: number
  endDate: number
  duration: number
  amount: number
}

export const writeUserData = (
  userKey: string,
  { startDate, endDate, duration, amount }: UserItem,
): void => {
  database.ref(`users/${userKey}`).push({
    startDate: startDate
      ? Date.parse(startDate.toISOString())
      : Date.parse(new Date().toISOString()),
    endDate: endDate ? Date.parse(endDate.toISOString()) : Date.parse(new Date().toISOString()),
    duration,
    amount,
  })
}

export const updateUserData = (userKey: string, targetKey: string, newData: UserItemV2): void => {
  database.ref(`users/${userKey}`).update({
    [targetKey]: newData,
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
        return Object.keys(obj).map(item => ({
          ...obj[item],
          key: item,
        }))
      } else {
        return []
      }
    })
}

export const removeUserDate = async (userKey: string, targetKey: string): Promise<any> => {
  await database.ref(`users/${userKey}`).child(targetKey).remove()
}
