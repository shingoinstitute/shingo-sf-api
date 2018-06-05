import { ServiceDefinition, ServiceError, serialize, deserialize, ServerCredentials, Metadata, ServerDuplexStream, ServerReadableStream, ServerWritableStream, ServerUnaryCall } from "grpc";

export class Server<T = any> {
  constructor(options?: any)
  addService(service: ServiceDefinition<T>, implementation: Record<string, handleCall<T>>): void;
  bind(port: string, creds: ServerCredentials): void;
  forceShutdown(): void;
  register(name: string, handler: handleCall<T>, serialize: serialize<T>, deserialize: deserialize<T>, type: string): boolean;
  start(): void;
  tryShutdown(callback: () => void): void;
}

// Type Definitions
type handleCall<T> = 
  | handleUnaryCall<T>
  | handleClientStreamingCall<T>
  | handleServerStreamingCall<T>
  | handleBidiStreamingCall<T>
  ;

type handleBidiStreamingCall<T> = (call: ServerDuplexStream<T>) => void;
type handleClientStreamingCall<T> = (call: ServerReadableStream<T>, callback: sendUnaryData) => void;
type handleServerStreamingCall<T> = (call: ServerWritableStream<T>) => void;
type handleUnaryCall<T> = (call: ServerUnaryCall, callback: sendUnaryData) => void;
type sendUnaryData = (error: ServiceError, value: any, trailer?: Metadata, flags?: number) => void;