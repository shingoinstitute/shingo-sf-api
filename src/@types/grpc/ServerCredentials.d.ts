export class ServerCredentials {
  static createInsecure(): ServerCredentials;
  static createSsl(rootCerts: Buffer | null, keyCertPairs: keyCertPair[], checkClientCertificate?: boolean): ServerCredentials
}

export interface keyCertPair {
  privateKey: Buffer;
  certChain: Buffer;
}