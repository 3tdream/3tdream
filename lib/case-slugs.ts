export const CASE_SLUGS = ["mission-control", "uxi-course"] as const;
export function hasCase(slug: string) { return CASE_SLUGS.some(value => value === slug); }
