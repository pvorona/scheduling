## Task scheduling

```ts
import { scheduleTask, PRIORITIES } from '@pvorona/scheduling'

let windowWidth: number | undefined

scheduleTask(() => {
  windowWidth = window.innerWidth
}, PRIORITIES.READ)

scheduleTask(() => {
  document.body.innerText = `Window width is ${windowWidth}px`
}, PRIORITIES.WRITE)

// Window width is 900px
```

Tasks are scheduled to be executed before the next animation frame. Execution order is based on the priority: `READ`, `COMPUTE`, `WRITE`, `FUTURE`.