import { Lambda, QueueByPriority } from './types'
import { PRIORITY, PRIORITIES_IN_ORDER } from './constants'

let performWorkFrameId: undefined | number = undefined

export const queueByPriority: QueueByPriority = {
  [PRIORITY.READ]: {
    tasks: [],
    isCancelledByIndex: {},
  },
  [PRIORITY.COMPUTE]: {
    tasks: [],
    isCancelledByIndex: {},
  },
  [PRIORITY.WRITE]: {
    tasks: [],
    isCancelledByIndex: {},
  },
  [PRIORITY.FUTURE]: {
    tasks: [],
    isCancelledByIndex: {},
  },
}

export function scheduleTask(task: Lambda, priority = PRIORITY.WRITE): Lambda {
  // Capture queue of the current frame
  // to prevent modifications of the future queues
  // when cancelling this task
  const { isCancelledByIndex, tasks } = queueByPriority[priority]
  const nextIndex = tasks.push(task)

  schedulePerformWorkIfNeeded()

  return function cancelTask() {
    isCancelledByIndex[nextIndex - 1] = true
  }
}

function schedulePerformWorkIfNeeded() {
  if (performWorkFrameId) return

  performWorkFrameId = requestAnimationFrame(performWork)
}

function performWork() {
  performWorkFrameId = undefined

  for (const priority of PRIORITIES_IN_ORDER) {
    const { tasks, isCancelledByIndex } = queueByPriority[priority]

    for (let i = 0; i < tasks.length; i++) {
      if (isCancelledByIndex[i]) {
        continue
      }

      tasks[i]()
    }

    queueByPriority[priority] = {
      tasks: [],
      isCancelledByIndex: {},
    }
  }
  if (queueByPriority[PRIORITY.FUTURE].tasks.length) {
    schedulePerformWorkIfNeeded()

    queueByPriority[PRIORITY.WRITE] = queueByPriority[PRIORITY.FUTURE]
    queueByPriority[PRIORITY.FUTURE] = {
      tasks: [],
      isCancelledByIndex: {},
    }
  }
}
