import { Client, Metadata, Credentials } from "grpc";

export interface LoadOptions {
  convertFieldsToCamelCase?: boolean;
  binaryAsBase64?: boolean;
  longsAsStrings?: boolean;
  deprecatedArgumentOrder?: boolean;
}

export interface LoadObjectOptions {
  binaryAsBase64?: boolean;
  longsAsStrings?: boolean;
  enumsAsStrings?: boolean;
  deprecatedArgumentOrder?: boolean;
  protobufjsVersion?: 5 | 6 | 'detect';
}

export interface CallError {
  readonly OK: 0;
  readonly ERROR: 1;
  readonly NOT_ON_SERVER: 2;
  readonly NOT_ON_CLIENT: 3;
  readonly ALREADY_INVOKED: 5;
  readonly NOT_INVOKED: 6;
  readonly ALREADY_FINISHED: 7;
  readonly TOO_MANY_OPERATIONS: 8;
  readonly INVALID_FLAGS: 9;
  readonly INVALID_METADATA: 10;
  readonly INVALID_MESSAGE: 11;
  readonly NOT_SERVER_COMPLETION_QUEUE: 12;
  readonly BATCH_TOO_BIG: 13;
  readonly PAYLOAD_TYPE_MISMATCH: 14;
}

export interface LogVerbosity {
  readonly DEBUG: 0;
  readonly INFO: 1;
  readonly ERROR: 2;
}

export interface Propogate {
  readonly DEADLINE: 1;
  readonly CENSUS_STATS_CONTEXT: 2;
  readonly CENSUS_TRACING_CONTEXT: 4;
  readonly CANCELLATION: 8;
  readonly DEFAULTS: 65535;
}

export interface Status {
  readonly OK: 0;
  readonly CANCELLED: 1;
  readonly UNKNOWN: 2;
  readonly INVALID_ARGUMENT: 3;
  readonly DEADLINE_EXCEEDED: 4;
  readonly NOT_FOUND: 5;
  readonly ALREADY_EXISTS: 6;
  readonly PERMISSION_DENIED: 7;
  readonly RESOURCE_EXHAUSTED: 8;
  readonly FAILED_PRECONDITION: 9;
  readonly ABORTED: 10;
  readonly OUT_OF_RANGE: 11;
  readonly UNIMPLEMENTED: 12;
  readonly INTERNAL: 13;
  readonly UNAVAILABLE: 14;
  readonly DATA_LOSS: 15;
  readonly UNAUTHENTICATED: 16;
}

export interface WriteFlags {
  readonly BUFFER_HINT: 1;
  readonly NO_COMPRESS: 2;
}

export const credentials: Credentials;

// Members
export const callError: CallError;
export const logVerbosity: LogVerbosity;
export const propogate: Propogate;
export const status: Status;
export const writeFlags: WriteFlags;

// Methods
export function closeClient(client_obj: Client): void;
export function load<T = any>(filename: string | object, format?: string, options?: LoadOptions): Record<string, T>;
export function loadObject(value: object, options?: LoadObjectOptions): Record<string, any>;
export function setLoger(logger: Console): void;
export function setLogVerbosity(verbosity: number): void;
export function getClientChannel(client: Client): any;
export function makeGenericClientConstructor<T>(methods: ServiceDefinition<T>, serviceName: string, class_options: { deprecatedArgumentOrder?: boolean }): { new (...args: any[]): Client<T> }
export function waitForClientReady(client: Client, deadline: Deadline, callback: (err?: any) => void):void;

// Type Definitions
export type Deadline = number | Date;
export type deserialize<T> = (data: Buffer) => T;
export interface MethodDefinition<T> {
  path: string;
  requestStream: boolean;
  responseStream: boolean;
  requestSerialize: serialize<T>;
  responseSerialize: serialize<T>;
  requestDeserialize: deserialize<T>
  responseDeserialize: deserialize<T>
}
export type serialize<T> = (value: T) => Buffer;
export type ServiceDefinition<T>= Record<string, MethodDefinition<T>>
export interface ServiceError extends Error {
  code: number;
  metadata: Metadata;
}

export interface StatusObject {
  code: number;
  details: string;
  metadata: Metadata;
}