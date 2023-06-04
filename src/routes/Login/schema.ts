import { z } from 'zod';

export const schema = z.object({
  id: z
    .string()
    .min(1, 'Это поле не может быть пустым!')
    .regex(/^[0-9]+$/, 'Поле должно содержать только цифры!')
    .default(''),
  apiToken: z
    .string()
    .min(1, 'Это поле не может быть пустым!')
    .regex(/^[a-z0-9]+$/, 'Поле должно содержать буквы a-z и цифры!')
    .default(''),
});

export type LoginFormFields = z.infer<typeof schema>;
