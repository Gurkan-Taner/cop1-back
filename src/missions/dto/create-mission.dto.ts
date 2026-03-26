import { z } from 'zod';

export const createMissionSchema = z.object({
  description: z.string(),
  title: z.string().max(30),
  status: z.string().max(20),
  location: z.string().max(40),
  type: z.string().max(30),
  date: z.string().max(30),
  isUrgent: z.boolean(),
  address: z.string().max(50),
});

export type CreateMissionDto = z.infer<typeof createMissionSchema>;
