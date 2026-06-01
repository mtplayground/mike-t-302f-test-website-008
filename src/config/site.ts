const configuredContactEmail = import.meta.env.PUBLIC_CONTACT_EMAIL?.trim();

export const siteName = "Agent Team for Founders";
export const siteDescription = "You just talk, we handle the rest";
export const siteImage = "/images/hero-workflow.png";
export const siteImageAlt = "Software delivery dashboard on a laptop in a modern workspace";
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
