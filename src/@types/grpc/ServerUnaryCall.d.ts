import { EventEmitter } from "events";
import { Call, Metadata, StatusObject } from "grpc";

export class ServerUnaryCall<T = any> extends EventEmitter {
  constructor(call: Call<T>, metadata: Metadata);

  cancelled: boolean;
  metadata: Metadata;
  request: T;

  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;

  removeAllListeners(event?: 'cancelled'): this;
  listeners(event: 'cancelled'): Function[];
  eventNames(): Array<'cancelled'>
  listenerCount(type: 'cancelled'): number;

  on(event: 'cancelled', listener: () => void): this;
  once(event: 'cancelled', listener: () => void): this;
  prependListener(event: 'cancelled', listener: () => void): this;
  prependOnceListener(event: 'cancelled', listener: () => void): this;
  removeListener(event: 'cancelled', listener: () => void): this;
}