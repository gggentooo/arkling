export type LanguageCode = 'zh' | 'en' | 'ja' | 'ko';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
}

export type LearningMode = 'side-by-side' | 'focused';

export type JapaneseAnnotationMode = 'none' | 'furigana' | 'romaji';

export interface ScriptLine {
  id: string;
  speaker?: Partial<Record<LanguageCode, string>>;
  text: Record<LanguageCode, string>;
  annotatedText?: Partial<Record<LanguageCode, string>>;
  notes?: string;
}

export interface ScriptDocument {
  id: string;
  title: string;
  chapter?: string;
  lines: ScriptLine[];
}

// Story hierarchy types for Arknights data submodule
export type StoryCategory = 'main' | 'side' | 'mini' | 'record';

export interface StoryCategoryOption {
  value: StoryCategory;
  label: string;
  description: string;
}

export interface StoryEpisode {
  storyId: string;
  storyGroup: string;
  storySort: number;
  storyCode: string;
  storyName: string;
  storyTxt: string;
  avgTag: string;
  displayName: string;
}

export interface StoryChapter {
  id: string;
  name: string;
  category: StoryCategory;
  episodes: StoryEpisode[];
}

export interface RawStoryUnlockData {
  storyReviewType?: string;
  storyId: string;
  storyGroup: string;
  storySort: number;
  storyDependence?: string | null;
  storyCanShow?: number;
  storyCode?: string;
  storyName: string;
  storyPic?: string | null;
  storyInfo?: string;
  storyCanEnter?: number;
  storyTxt: string;
  avgTag?: string;
  unLockType?: string;
}

export interface RawStoryReviewEntry {
  id: string;
  name: string;
  entryType: string;
  actType?: string;
  infoUnlockDatas: RawStoryUnlockData[];
}

export type RawStoryReviewTable = Record<string, RawStoryReviewEntry>;
