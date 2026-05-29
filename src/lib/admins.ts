// Admin emails - comma separated in env var: NEXT_PUBLIC_ADMIN_EMAILS
// e.g. NEXT_PUBLIC_ADMIN_EMAILS=admin@gmail.com,other@gmail.com
const envAdmins = process.env.NEXT_PUBLIC_ADMIN_EMAILS || "";
export const ADMIN_EMAILS: string[] = envAdmins
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export const isAdminEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};
