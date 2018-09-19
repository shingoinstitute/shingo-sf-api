import { plainToClass, classToPlain } from 'class-transformer'
import { validate, ValidationError as VError } from 'class-validator'

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type Overwrite<A extends object, B extends object> = Pick<
  A,
  Exclude<keyof A, keyof B>
> &
  B

export type RequireKeys<T extends object, K extends keyof T> = Overwrite<
  T,
  { [key in K]-?: T[key] }
>

export type OptionalKeys<T extends object, K extends keyof T> = Overwrite<
  T,
  { [key in K]+?: T[key] }
>

// from tycho01/typical
export type DeepRequired<T> = NonNullable<
  T extends any[]
    ? DeepRequiredArray<T[number]>
    : T extends object ? DeepRequiredObject<T> : T
>
interface DeepRequiredArray<T> extends Array<DeepRequired<T>> {}

type DeepRequiredObject<T> = { [P in keyof T]+?: DeepRequired<T[P]> }

export interface ClassType<T> {
  new (...args: any[]): T
}

export const toClass = <T>(cls: ClassType<T>) => (plain: object) =>
  plainToClass(cls, plain)

export { classToPlain }

export const validateInput = <T>(
  cls: ClassType<T>,
  options: { partial?: boolean; groups?: string[] } = {},
) => <U extends object>(plain: U) => {
  const instance =
    plain instanceof cls ? ((plain as any) as T) : plainToClass(cls, plain)
  return validate(instance, {
    validationError: { target: process.env.NODE_ENV !== 'production' },
    skipMissingProperties: !!options.partial,
    groups: options.groups || [],
  }).then(errs => {
    if (errs.length === 0) return instance
    throw new ValidationError(errs)
  })
}

export class ValidationError extends Error {
  message = 'Error, Invalid input'
  name = 'ValidationError'
  errors: VError[]

  constructor(errors: VError[], message?: string) {
    super()
    this.message = message || this.message
    this.errors = errors
  }
}
