import { z } from 'zod';

export const schema = z.object({
  phone: z
    .string()
    .regex(/^\+7\s\([0-9]{3}\)\s[0-9]{3}-[0-9]{2}-[0-9]{2}$/, 'Номер введен неверно!'),
});

export type CreateChatFields = z.infer<typeof schema>;
