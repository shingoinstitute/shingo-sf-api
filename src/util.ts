
export function omit<T extends {}, K extends keyof T>(record: T, fields: K[]): Pick<T, Exclude<keyof T, K>>
export function omit<T extends {}, K extends keyof T>(record: T, ...fields: K[]): Pick<T, Exclude<keyof T, K>>
export function omit<T extends {}, K extends keyof T>(record: T, fields: K[]): Pick<T, Exclude<keyof T, K>> {
  const keeps = Object.keys(record).filter(k => fields.indexOf(k as any) === -1);
  const obj = {} as any;

  for (const key of keeps) {
    obj[key] = (record as any)[key];
  }

  return obj as any;
}