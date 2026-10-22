// The fixed slugs POST /api/lead accepts. Server-safe on purpose: lib/content.ts
// is a client module (it calls L() from lib/i18n.tsx), and the route's zod
// schema must not import it — Next refuses to call a client function from a
// Route Handler. content.ts re-exports these for the form's option lists.
export const LEAD_ROLE_VALUES = ["founder", "product", "engineering", "other"] as const;
export const LEAD_INDUSTRY_VALUES = ["beauty", "ecommerce", "care", "education", "other"] as const;
export const LEAD_COMPANY_SIZE_VALUES = ["solo", "small", "medium", "large"] as const;
