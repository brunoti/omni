export function unflatten<T>(obj: T): any {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      current[part] = current[part] || {};
      current = current[part];
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}
