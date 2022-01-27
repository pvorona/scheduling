export type Lambda = () => void

import { PRIORITY } from './constants'

export type QueueByPriority = {
  [value in PRIORITY]: {
    tasks: Lambda[]
    isCancelledByIndex: { [index: number]: boolean }
  }
}
