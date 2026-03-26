import { z } from 'zod';

export const updateSlotSchema = z.object({
  startAt: z.date(),
  endAt: z.date(),
  placeAvailable: z.number(),
});

export type UpdateSlotDto = z.infer<typeof updateSlotSchema>;
