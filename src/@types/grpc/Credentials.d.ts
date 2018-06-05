import { Metadata } from "grpc";

export interface CallCredentials {}
export interface ChannelCredentials {}

export interface Credentials {
  combineCallCredentials(...credentials: CallCredentials[]): CallCredentials;
  combineChannelCredentials(channel_credential: ChannelCredentials, ...credentials: CallCredentials[]): ChannelCredentials
  createFromGoogleCredential(google_credential: any): CallCredentials;
  createFromMetadataGenerator(metadata_generator: generateMetadata): CallCredentials;
  createInsecure(): ChannelCredentials;
  createSsl(root_certs: Buffer, private_key: Buffer, cert_chain: Buffer): ChannelCredentials;
}

export type generateMetadata = (params: { service_url: string }, callback: metadataCallback) => void;
export type metadataCallback = (error: Error | null | undefined, metadata: Metadata) => void;