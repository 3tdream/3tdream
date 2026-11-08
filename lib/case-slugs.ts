import { CASES } from "./cases";

// One source of truth keeps the catalog, static routes and case navigation aligned.
export const CASE_SLUGS = Object.keys(CASES);
export function hasCase(slug: string) {
  return Object.prototype.hasOwnProperty.call(CASES, slug);
}
