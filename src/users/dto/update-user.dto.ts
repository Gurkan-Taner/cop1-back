import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  number: z.string().max(15).optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
