export interface RegisterResponse {
  message: string;
  user?: {
    id: string;
    email?: string;
    username?: string;
  };
}
