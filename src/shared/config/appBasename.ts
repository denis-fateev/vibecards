/** React Router basename (no trailing slash). Empty when app is served from domain root. */
export function getAppBasename(): string | undefined {
  const base = import.meta.env.BASE_URL;
  if (base === '/') {
    return undefined;
  }
  return base.endsWith('/') ? base.slice(0, -1) : base;
}
