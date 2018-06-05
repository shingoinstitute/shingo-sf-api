import { Duplex } from "stream";
import { Call, serialize, deserialize, Metadata, StatusObject } from "grpc";

export class ClientDuplexStream<T = any> extends Duplex {
  constructor(call: Call<T>, serialize?: serialize<T>, deserialize?: deserialize<T>)
  cancel(): void;
  getPeer(): string;
  write(...args: any[]): boolean;
  write(message: T, flags: number, callback: () => void): boolean;

  addListener(event: string, listener: Function): this;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;

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