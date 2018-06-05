import { Readable } from "stream";
import { deserialize, Call, Metadata, StatusObject } from "grpc";

export class ServerReadableStream<T = any> extends Readable {
  constructor(call: Call<T>, metadata: Metadata, deserialize: deserialize<T>)

  cancelled: boolean;
  metadata: Metadata;

  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;

  addListener(event: string, listener: Function): this;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;

  on(event: 'cancelled', listener: () => void): this;
  once(event: 'cancelled', listener: () => void): this;
  prependListener(event: 'cancelled', listener: () => void): this;
  prependOnceListener(event: 'cancelled', listener: () => void): this;
  removeListener(event: 'cancelled', listener: () => void): this;
}