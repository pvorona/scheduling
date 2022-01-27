/**
 * @jest-environment jsdom
 */

import { scheduleTask } from './scheduling'
import { PRIORITY } from './constants'

const FRAME_INTERVAL = 100

describe('scheduleTask', () => {
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

    scheduleTask(() => mock('write 1'), PRIORITY.WRITE)
    scheduleTask(() => mock('compute 1'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('read 1'), PRIORITY.READ)

    scheduleTask(() => mock('compute 2'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('write 2'), PRIORITY.WRITE)
    scheduleTask(() => mock('read 2'), PRIORITY.READ)

    scheduleTask(() => mock('read 3'), PRIORITY.READ)
    scheduleTask(() => mock('compute 3'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('write 3'), PRIORITY.WRITE)

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenNthCalledWith(1, 'read 1')
    expect(mock).toHaveBeenNthCalledWith(2, 'read 2')
    expect(mock).toHaveBeenNthCalledWith(3, 'read 3')

    expect(mock).toHaveBeenNthCalledWith(4, 'compute 1')
    expect(mock).toHaveBeenNthCalledWith(5, 'compute 2')
    expect(mock).toHaveBeenNthCalledWith(6, 'compute 3')

    expect(mock).toHaveBeenNthCalledWith(7, 'write 1')
    expect(mock).toHaveBeenNthCalledWith(8, 'write 2')
    expect(mock).toHaveBeenNthCalledWith(9, 'write 3')

    expect(mock).toHaveBeenCalledTimes(9)

    scheduleTask(() => mock('write 4'), PRIORITY.WRITE)
    scheduleTask(() => mock('compute 4'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('read 4'), PRIORITY.READ)

    scheduleTask(() => mock('compute 5'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('write 5'), PRIORITY.WRITE)
    scheduleTask(() => mock('read 5'), PRIORITY.READ)

    scheduleTask(() => mock('read 6'), PRIORITY.READ)
    scheduleTask(() => mock('compute 6'), PRIORITY.COMPUTE)
    scheduleTask(() => mock('write 6'), PRIORITY.WRITE)

    expect(mock).toHaveBeenCalledTimes(9)

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenNthCalledWith(10, 'read 4')
    expect(mock).toHaveBeenNthCalledWith(11, 'read 5')
    expect(mock).toHaveBeenNthCalledWith(12, 'read 6')

    expect(mock).toHaveBeenNthCalledWith(13, 'compute 4')
    expect(mock).toHaveBeenNthCalledWith(14, 'compute 5')
    expect(mock).toHaveBeenNthCalledWith(15, 'compute 6')

    expect(mock).toHaveBeenNthCalledWith(16, 'write 4')
    expect(mock).toHaveBeenNthCalledWith(17, 'write 5')
    expect(mock).toHaveBeenNthCalledWith(18, 'write 6')

    expect(mock).toHaveBeenCalledTimes(18)
  })

  it('cancels task', () => {
    const mock = jest.fn()

    const cancel1 = scheduleTask(() => mock('task 1'))
    const cancel2 = scheduleTask(() => mock('task 2'))
    const cancel3 = scheduleTask(() => mock('task 3'))
    cancel2()
    const cancel4 = scheduleTask(() => mock('task 4'))
    cancel4()

    expect(mock).not.toHaveBeenCalled()

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenNthCalledWith(1, 'task 1')
    expect(mock).toHaveBeenNthCalledWith(2, 'task 3')

    expect(mock).toHaveBeenCalledTimes(2)

    scheduleTask(() => mock('task 5'))
    const cancel6 = scheduleTask(() => mock('task 6'))
    scheduleTask(() => mock('task 7'))
    scheduleTask(() => mock('task 8'))

    cancel6()
    cancel1()
    cancel3()
    cancel4()

    expect(mock).toHaveBeenCalledTimes(2)

    jest.advanceTimersByTime(FRAME_INTERVAL)

    expect(mock).toHaveBeenNthCalledWith(3, 'task 5')
    expect(mock).toHaveBeenNthCalledWith(4, 'task 7')
    expect(mock).toHaveBeenNthCalledWith(5, 'task 8')

    expect(mock).toHaveBeenCalledTimes(5)
  })
})
