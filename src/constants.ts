export enum PRIORITY {
  READ,
  COMPUTE,
  WRITE,
  FUTURE,
}

export const PRIORITIES_IN_ORDER = [
  PRIORITY.READ,
  PRIORITY.COMPUTE,
  PRIORITY.WRITE,
]
