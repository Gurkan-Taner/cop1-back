import { z } from 'zod';

export const updateUserSchema = z.object({
  email: z.email(),
  firstName: z.string(),
  lastName: z.string(),
  number: z.string().max(15),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
