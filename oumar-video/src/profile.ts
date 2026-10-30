import { z } from "zod";

export const profileSchema = z.object({
  handle: z.string(),
  name: z.string(),
  posts: z.number(),
  followers: z.number(),
  following: z.number(),
  bio: z.string(),
});

export type Profile = z.infer<typeof profileSchema>;

export const ruNumber = (n: number) =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const ruPlural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
