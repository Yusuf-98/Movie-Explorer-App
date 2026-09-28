import { z } from 'zod';

export const searchSchema = z.object({
  query: z
    .string()
    .max(100, 'Query too long')
    .refine((val) => val.trim().length === 0 || val.trim().length >= 2, {
      message: 'Type at least 2 characters',
    }),
});

export type SearchFormValues = z.infer<typeof searchSchema>;
