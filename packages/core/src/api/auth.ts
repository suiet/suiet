export interface IAuthApi {
  generateToken: (password: string) => string;
  validateToken: (encrypted: string) => boolean;
}