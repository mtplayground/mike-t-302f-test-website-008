const configuredContactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL?.trim();

export const siteName = "Agent Team for Founders";
export const siteDescription = "You just talk, we handle the rest";
export const contactEmail = configuredContactEmail || "contact@example.com";
export const contactHref = `mailto:${contactEmail}`;
export const currentYear = new Date().getFullYear();

export const navLinks = [
  {
    label: "Home",
    href: "/"
  },
  {
    label: "Contact",
    href: contactHref
  }
] as const;
