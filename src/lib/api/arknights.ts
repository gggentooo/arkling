import type { LanguageCode, RawStoryReviewTable } from '../../types';

const DATA_SOURCES: Record<LanguageCode, string> = {
  zh: 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/',
  en: 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/en/',
  ja: 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/jp/',
  ko: 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/kr/'
};

// In-memory caches to avoid redundant HTTP requests
const tableCache = new Map<LanguageCode, RawStoryReviewTable>();
const scriptCache = new Map<string, string>();

export function getRawBaseUrl(language: LanguageCode): string {
  return DATA_SOURCES[language] || DATA_SOURCES.en;
}

export async function fetchStoryReviewTable(language: LanguageCode): Promise<RawStoryReviewTable> {
  if (tableCache.has(language)) {
    return tableCache.get(language)!;
  }

  const sessionKey = `ark_story_table_${language}`;
  try {
    const cached = sessionStorage.getItem(sessionKey);
    if (cached) {
      const parsed = JSON.parse(cached) as RawStoryReviewTable;
      tableCache.set(language, parsed);
      return parsed;
    }
  } catch {
  }

  const url = `${getRawBaseUrl(language)}gamedata/excel/story_review_table.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch story review table for ${language} (${response.status} ${response.statusText})`);
  }

  const data = (await response.json()) as RawStoryReviewTable;
  tableCache.set(language, data);

  try {
    sessionStorage.setItem(sessionKey, JSON.stringify(data));
  } catch {
  }

  return data;
}

export async function fetchStoryScriptRaw(language: LanguageCode, storyTxt: string): Promise<string> {
  const cleanKey = storyTxt.replace(/^\/+/, '').replace(/\.txt$/, '');
  const cacheKey = `${language}:${cleanKey}`;

  if (scriptCache.has(cacheKey)) {
    return scriptCache.get(cacheKey)!;
  }

  const url = `${getRawBaseUrl(language)}gamedata/story/${cleanKey}.txt`;
  const response = await fetch(url);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`STORY_NOT_FOUND_404: Script "${cleanKey}" is not available in ${language.toUpperCase()}.`);
    }
    throw new Error(`HTTP error ${response.status} fetching script "${cleanKey}" in ${language.toUpperCase()}.`);
  }

  const text = await response.text();
  scriptCache.set(cacheKey, text);
  return text;
}
