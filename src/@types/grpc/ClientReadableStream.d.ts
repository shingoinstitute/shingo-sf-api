import { Readable } from "stream";
import { deserialize, Call, Metadata, StatusObject } from "grpc";

export class ClientReadableStream<T = any> extends Readable {
  constructor(call: Call<T>, deserialize?: deserialize<T>)

  cancel(): void;
  getPeer(): string;

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