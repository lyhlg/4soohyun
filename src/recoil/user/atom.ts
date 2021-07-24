import { atom } from 'recoil'

export default atom<{
  userId: string
  startDate?: number
  endDate?: number
}>({
  key: 'user',
  default: {
    userId: '',
    startDate: new Date().getTime(),
    endDate: new Date().getTime(),
  },
})
