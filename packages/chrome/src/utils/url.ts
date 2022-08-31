export function detectNestedPath(path: unknown) {
  if (typeof path !== 'string') {
    return {
      isNested: false,
      paths: [],
      lastPath: '',
    }
  }
  let _path = path.startsWith('/') ? path.slice(1) : path;
  const match = /^[a-zA-Z_]*\/.*$/.exec(_path);
  const paths = _path.split('/');
  return {
    isNested: !!match,
    paths,
    lastPath: paths.at(paths.length - 1),
  };
}