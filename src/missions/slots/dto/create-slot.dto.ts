import { z } from 'zod';

export const createSlotSchema = z.object({
  startAt: z.date(),
  endAt: z.date(),
  placeAvailable: z.number(),
});

export type CreateSlotDto = z.infer<typeof createSlotSchema>;
