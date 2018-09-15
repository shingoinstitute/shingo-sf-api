import { plainToClass } from 'class-transformer'
import { ServiceError, Metadata, status as Status } from 'grpc'
import { validate, ValidationError } from 'class-validator'

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

export type ClassType<T> = {
  new (...args: any[]): T
}

export const toClass = <T>(cls: ClassType<T>) => (plain: object) =>
  plainToClass(cls, plain)

export const validateInput = <T>(
  cls: ClassType<T>,
  options: { partial?: boolean; groups?: string[] } = {},
) => <U extends object>(plain: U) => {
  const instance = plain instanceof cls ? plain : plainToClass(cls, plain)
  return validate(instance, {
    validationError: { target: process.env.NODE_ENV !== 'production' },
    skipMissingProperties: !!options.partial,
    groups: options.groups || [],
  }).then(errs => {
    if (errs.length === 0) return instance
    throw new ValidationException(errs)
  })
}

export class ValidationException implements ServiceError {
  code = Status.INVALID_ARGUMENT
  metadata?: Metadata | undefined
  name = 'Validation_Error'
  message = 'Error, Invalid input'
  stack?: string | undefined

  constructor(errors: ValidationError[], message?: string) {
    this.message = message || this.message
    this.metadata = new Metadata()
    this.metadata.add('validation-errors', Buffer.from(JSON.stringify(errors)))
  }
}
