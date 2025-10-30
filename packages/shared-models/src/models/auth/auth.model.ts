import { z } from 'zod';
import { SafeUserSchema } from '../user/user.model';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

export const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must not exceed 20 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password must not exceed 100 characters'),
});

export type RegisterCredentials = z.infer<typeof RegisterSchema>;

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  user: SafeUserSchema,
});

export type AuthResponse = z.infer<typeof AuthResponseSchema>;

export const JwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string().email(),
  username: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
