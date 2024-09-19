export const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "de", name: "German" },
  { code: "fr", name: "French" },
  { code: "pt", name: "Portuguese" },
  { code: "pl", name: "Polish" },
];

export const getLanguageName = (code: string): string => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

export const getLanguageCode = (name: string): string => {
  const language = languages.find(lang => lang.name === name);
  return language ? language.code : name;
};