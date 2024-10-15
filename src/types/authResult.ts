import { UserDTO } from "./user";

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  user: UserDTO;
}
