import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  number: z.string().max(15),
  password: z.string().min(10),
  email: z.email(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
