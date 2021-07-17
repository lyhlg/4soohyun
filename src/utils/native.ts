import { Storage } from '@capacitor/storage'
import { encode } from 'js-base64'

export const getUserKey = async (): Promise<string> => {
  const { value } = await Storage.get({ key: 'userKey' })
  return value ?? ''
}

export const setUserKey = async (userName: string, password: string): Promise<void> => {
  const userId = `${encode(userName)}-${encode(password)}`
  await Storage.set({ key: 'userKey', value: userId })
}
