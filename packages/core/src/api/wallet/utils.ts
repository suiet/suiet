// default avatar should loop to avoid duplicated
export function whichAvatar(walletId: number) {
  const avatarNums = 4;
  // Note: walletId starts from 1, range [1, ..., avatarNums]
  return String(((walletId - 1) % avatarNums) + 1);
}
