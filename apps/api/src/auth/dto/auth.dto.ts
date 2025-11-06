import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export class LoginDto extends createZodDto(LoginSchema) {}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}
