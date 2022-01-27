import { Lambda } from './types'
import { PRIORITY } from './constants'
import { scheduleTask } from './scheduling'

export function createScheduleTaskWithCleanup(
  task: Lambda,
  priority?: PRIORITY,
): Lambda {
  let cancelTask: undefined | Lambda

  return function scheduleTaskAndCleanUpIfNeeded() {
    cancelTask?.()

    cancelTask = scheduleTask(task, priority)
  }
}
