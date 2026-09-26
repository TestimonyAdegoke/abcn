export const legalPlaceholders = {
  legalEntityName: "[LEGAL ENTITY NAME]",
  legalForm: "[LEGAL FORM]",
  streetAddress: "[STREET / HOUSE NUMBER]",
  postalCity: "[POSTCODE / CITY]",
  country: "[COUNTRY]",
  representative: "[AUTHORIZED REPRESENTATIVE]",
  email: "[LEGAL / PRIVACY CONTACT EMAIL]",
  phone: "[TELEPHONE NUMBER]",
  registerCourt: "[REGISTER / REGISTER COURT]",
  registerNumber: "[REGISTER NUMBER]",
  vatId: "[VAT ID / USt-IdNr., IF APPLICABLE]",
  editorialResponsible: "[EDITORIALLY RESPONSIBLE PERSON, IF APPLICABLE]",
  euRepresentative: "[EU REPRESENTATIVE UNDER ART. 27 GDPR, IF REQUIRED]",
  dpo: "[DATA PROTECTION OFFICER, IF APPLICABLE]",
  supervisoryAuthority: "[COMPETENT DATA PROTECTION SUPERVISORY AUTHORITY]",
  applicationRetention: "[APPLICATION DATA RETENTION PERIOD]",
  serverLogRetention: "[SERVER LOG RETENTION PERIOD]",
};

export const privacyInfrastructure = {
  hosting: "Vercel",
  database: "Neon",
};

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://abcn.network";

