export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
}

export interface CheckUsernameResponse {
  available: boolean;
  username: string;

}