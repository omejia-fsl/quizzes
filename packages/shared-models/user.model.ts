import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string(),
  username: z.string().min(3).max(20),
  email: z.string().email(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type User = z.infer<typeof UserSchema>

export const CreateUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export type CreateUser = z.infer<typeof CreateUserSchema>

export const SafeUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type SafeUser = z.infer<typeof SafeUserSchema>