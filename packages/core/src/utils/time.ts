export async function sleep(duration = 0) {
  return await new Promise((resolve) => {
    setTimeout(function () {
      resolve(undefined);
    }, duration);
  });
}
