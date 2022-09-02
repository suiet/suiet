export function sleep(duration = 0) {
  return new Promise((resolve) => {
    setTimeout(function () {
      resolve(undefined);
    }, duration);
  });
}
