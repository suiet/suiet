export interface IAuthApi {
  updatePassword: (oldPassword: string | null, newPassword: string) => Promise<void>;
  loadTokenWithPassword: (password: string) => Promise<string>;
}