import { atom } from 'recoil'

export default atom<{
  startDate: Date | null
  endDate: Date | null
  duration: number | null
}>({
  key: 'milk',
  default: {
    startDate: null,
    endDate: null,
    duration: null,
  },
})
