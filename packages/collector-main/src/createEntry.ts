export function createEntry(entries: string[]) {
  return entries.reduce(
    (agg, path) => ({
      ...agg,
      [path.replace(/\//g, '__')]: `./${path}`,
    }),
    {}
  );
}
