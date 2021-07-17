import { decode } from 'js-base64'
import userAtom from './'
import { selector } from 'recoil'

const getUserName = selector({
  key: 'getUserName',
  get: ({ get }) => {
    const userState = get(userAtom)

    return decode(userState.userId.split('-')[0])
  },
})

export default {
  getUserName,
}
