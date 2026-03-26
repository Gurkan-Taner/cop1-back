import { z } from 'zod';

export const loginSchema = z.object({
  password: z.string(),
  email: z.email(),
});

export type LoginDto = z.infer<typeof loginSchema>;
