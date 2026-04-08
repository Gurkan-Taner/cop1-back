import { z } from 'zod';

export const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
  passwordConfirm: z.string().min(8),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
