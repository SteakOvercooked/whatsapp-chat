import { z } from 'zod';

export const schema = z.object({
  idInstance: z
    .string()
    .min(1, 'Это поле не может быть пустым!')
    .regex(/^[0-9]+$/, 'Поле содержит только цифры!')
    .default(''),
  apiTokenInstance: z
    .string()
    .min(1, 'Это поле не может быть пустым!')
    .regex(/^[a-z0-9]+$/, 'Поле содержит буквы a-z и цифры!')
    .default(''),
});

export type LoginFormFields = z.infer<typeof schema>;
