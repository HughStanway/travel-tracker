export interface TravelItem {
  id: string;
  name: string;
  description: string;
  section: string;
  file: string;
  initialChecked?: boolean;
  raw: string;
}

export interface TravelSection {
  id: string;
  title: string;
  items: TravelItem[];
}

export interface TravelFile {
  filename: string;
  relativePath: string;
  title: string;
  rawContent: string;
  sections: TravelSection[];
  items: TravelItem[];
}

export interface TravelPlan {
  id: string;
  slug: string;
  title: string;
  folder: string;
  files: TravelFile[];
  totalItems: number;
  totalSections: number;
  items: TravelItem[];
}
