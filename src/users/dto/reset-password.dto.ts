import { z } from 'zod';

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmNewPassword: z.string().min(8),
});

export type ResetPasswordDto = z.infer<typeof resetPasswordSchema>;
