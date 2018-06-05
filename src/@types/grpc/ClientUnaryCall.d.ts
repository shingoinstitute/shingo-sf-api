import { EventEmitter } from "events";
import { Call, Metadata, StatusObject } from "grpc";

export class ClientUnaryCall<T> extends EventEmitter {
  constructor(call: Call<T>);

  cancel(): void;
  getPeer(): string;

  removeAllListeners(event?: 'metadata' | 'status'): this;
  listeners(event: 'metadata' | 'status'): Function[];
  eventNames(): Array<'metadata' | 'status'>
  listenerCount(type: 'metadata' | 'status'): number;

  on(event: 'metadata', listener: (src: Metadata) => void): this;
  once(event: 'metadata', listener: (src: Metadata) => void): this;
  prependListener(event: 'metadata', listener: (src: Metadata) => void): this;
  prependOnceListener(event: 'metadata', listener: (src: Metadata) => void): this;
  removeListener(event: 'metadata', listener: (src: Metadata) => void): this;

  on(event: 'status', listener: (src: StatusObject) => void): this;
  once(event: 'status', listener: (src: StatusObject) => void): this;
  prependListener(event: 'status', listener: (src: StatusObject) => void): this;
  prependOnceListener(event: 'status', listener: (src: StatusObject) => void): this;
  removeListener(event: 'status', listener: (src: StatusObject) => void): this;
}