import { Duplex } from "stream";
import { Call, serialize, deserialize, Metadata, StatusObject } from "grpc";

export class ServerDuplexStream<T = any> extends Duplex {
  constructor(call: Call<T>, metadata: Metadata, serialize: serialize<T>, deserialize: deserialize<T>)
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