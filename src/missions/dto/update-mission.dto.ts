import { z } from 'zod';

export const updateMissionSchema = z.object({
  description: z.string(),
  title: z.string().max(30),
  status: z.string().max(20),
  location: z.string().max(40),
  category: z.string().max(30),
  date: z.date(),
  isUrgent: z.boolean(),
  address: z.string().max(50),
});

export type UpdateMissionDto = z.infer<typeof updateMissionSchema>;
