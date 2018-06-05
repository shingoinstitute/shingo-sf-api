export class Metadata {
  add(key: string, value: string | Buffer): void;
  clone(): Metadata;
  get(key: string): Array<string | Buffer>;
  getMap(): Record<string, string | Buffer>;
  remove(key: string): void;
  set(key: string, value: string | Buffer): void;
}