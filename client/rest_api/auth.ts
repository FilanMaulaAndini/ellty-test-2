import { CheckUsernameResponse, RegisterResponse } from '@/app/shared/types/register';
import BaseApiFetch from './base'

interface RegisterPayload {
    email: string;
    password: string;
    username: string;
  }

  interface CheckUsernamePayload {
    username: string;
  }

  interface LoginPayload {
    username: string;
    password: string;
  }
  
  interface LoginResponse {
    token: string;
    user?: {
      id: string;
      email?: string;
      username?: string;
    };
  }
  
  class AuthApi extends BaseApiFetch {
    async register(json: RegisterPayload): Promise<RegisterResponse> {
      return this.fetch('/auth/register', 'POST', {
        json,
      });
    }

    async checkUsername(json: CheckUsernamePayload): Promise<CheckUsernameResponse> {
      return this.fetch('/auth/check-username', 'POST', {
        json,
      });
    }

    async login(json: LoginPayload): Promise<LoginResponse> {
        return this.fetch('/auth/login', 'POST', {
          json,
        });
      }
  }
  
  const authApi = new AuthApi();
  
  export default authApi;
