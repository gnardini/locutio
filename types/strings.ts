export type Strings = {
  [key: string]: string | Strings;
};

export interface FileInfo {
  file: string;
  rows: number;
}

export interface String {
  id: string;
  organization_id: string;
  file: string;
  key: string;
  value: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface LanguageStringCount {
  language: string;
  count: number;
}

export interface FileStringCount {
  file: string;
  baseCount: number;
  compareCount: number;
}
