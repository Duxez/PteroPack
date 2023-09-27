
export interface Modpack {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  links: Link;
  summary: string;
  status: number;
  downloadCount: number;
  isFeatured: boolean;
  primaryCategoryId: number;
  categories: Category[];
  classId: number;
  authors: Author[];
  logo: Image;
  screenshots: Image[];
  mainFileId: number;
  latestFiles: File[];
  latestFileIndexes: FileIndex[];
  latestEarlyAccessFileIndexes: FileIndex[];
  dateCreated: string;
  dateModified: string;
  dateReleased: string;
  allowModDistribution: boolean;
  gamePopularityRank: number;
  isAvailable: boolean;
  thumbsUpCount: number;
}

export interface Link {
  websiteUrl: string;
  wikiUrl: string|null;
  issuesUrl: string|null;
  sourceUrl: string|null;
}

export interface Category {
  id: number;
  gameId: number;
  name: string;
  slug: string;
  url: string;
  iconUrl: string;
  dateModified: string;
  isClass: boolean;
  classId: number;
  parentCategoryId: number;
}

export interface Author {
  id: number;
  name: string;
  url: string;
}

export interface Image {
  id: number;
  modId: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  url: string;
}

export interface File {
  id: number;
  gameId: number;
  modId: number;
  isAvailable: boolean;
  displayName: string;
  fileName: string;
  releaseType: number;
  fileStatus: number;
  hashes: Hash[];
  fileDate: string;
  fileLength: number;
  downloadCount: number;
  downloadUrl: string;
  gameVersions: string[];
  sortableGameVersion: GameVersion[];
  dependencies: any[];
  alternateFileId: number;
  isServerPack: boolean;
  fileFingerprint: number;
  modules: any[];
}

export interface Hash {
  value: string;
  algorithm: number;
}

export interface GameVersion {
  gameVersionName: string;
  gameVersionPadded: string;
  gameVersion: string;
  gameVersionReleaseDate: string;
  gameVersionTypeID: number;
}

export interface FileIndex {
  gameVersion: string;
  fileId: number;
  filename: string;
  releaseType: number;
  gameVersionTypeId: number;
  modLoader: number;
}
