import { atom } from 'recoil'

export default atom<{
  userId: string
}>({
  key: 'user',
  default: {
    userId: '',
  },
})
