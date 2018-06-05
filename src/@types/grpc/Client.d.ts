import { serialize, deserialize, ServiceError, Deadline, Metadata, ClientReadableStream, ClientDuplexStream, ClientUnaryCall, ClientWritableStream, ChannelCredentials, CallCredentials } from "grpc";

export class Client<T = any> {
  constructor(address: string, credentials: ChannelCredentials, options: object)
  close(): void;
  getChannel(): any;
  makeBidiStreamRequest(method: string, serialize: serialize<T>, deserialize: deserialize<T>, metadata?: Metadata, options?: CallOptions<T>): ClientDuplexStream<T>;
  makeClientStreamRequest(method: string, serialize: serialize<T>, deserialize: deserialize<T>, metadata: Metadata | null, options: CallOptions<T> | null, callback: requestCallback): ClientWritableStream<T>;
  makeServerStreamRequest(method: string, serialize: serialize<T>, deserialize: deserialize<T>, argument: any, metadata?: Metadata, options?: CallOptions<T>): ClientReadableStream<T>;
  makeUnaryRequest(method: string, serialize: serialize<T>, deserialize: deserialize<T>, argument: any, metadata: Metadata | null, options: CallOptions<T> | null, callback: requestCallback): ClientUnaryCall<T>;
  waitForReady(deadline: Deadline, callback: () => void): void;
}

// Type Definitions
export type Call<T> =
  | ClientUnaryCall<T>
  | ClientReadableStream<T>
  | ClientWritableStream<T>
  | ClientDuplexStream<T>
  ;

export interface CallOptions<T> {
  deadline: Deadline;
  host: string;
  parent: Call<T>;
  propogate_flags: number;
  credentials: CallCredentials;
}

export type requestCallback = (error: ServiceError | null, value: any) => void;