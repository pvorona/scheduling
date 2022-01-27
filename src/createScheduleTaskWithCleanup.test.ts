/**
 * @jest-environment jsdom
 */

import { createScheduleTaskWithCleanup } from './createScheduleTaskWIthCleanup'
import { PRIORITY } from './constants'

const FRAME_INTERVAL = 100

describe('createScheduleTaskWithCleanup', () => {
  let frameIndex = 0

  beforeAll(() => {
    jest.useFakeTimers()

    window.requestAnimationFrame = (callback: (n: number) => void) => {
      setTimeout(() => callback(0), FRAME_INTERVAL)

      return frameIndex++
    }
  })

  it('schedules tasks and executes them in specified order', () => {
    const mock = jest.fn()

    const write = createScheduleTaskWithCleanup(
      () => mock('write'),
      PRIORITY.WRITE,
    )
    const compute = createScheduleTaskWithCleanup(
      () => mock('compute'),
      PRIORITY.COMPUTE,
    )
    const read = createScheduleTaskWithCleanup(
      () => mock('read'),
      PRIORITY.READ,
    )

    write()
    compute()
    read()

    compute()
    write()
    read()

    read()
    compute()
    write()

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenNthCalledWith(1, 'read')
    expect(mock).toHaveBeenNthCalledWith(2, 'compute')
    expect(mock).toHaveBeenNthCalledWith(3, 'write')

    expect(mock).toHaveBeenCalledTimes(3)

    write()
    compute()
    read()

    compute()
    write()
    read()

    read()
    compute()
    write()

    expect(mock).toHaveBeenCalledTimes(3)

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenNthCalledWith(4, 'read')
    expect(mock).toHaveBeenNthCalledWith(5, 'compute')
    expect(mock).toHaveBeenNthCalledWith(6, 'write')

    expect(mock).toHaveBeenCalledTimes(6)
  })
})
