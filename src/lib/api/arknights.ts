import type { LanguageCode, RawStoryReviewTable } from '../../types';

// Data source URLs as specified:
// - Mandarin (CN): Kengxxiao/ArknightsGameData
// - English (EN), Japanese (JP), Korean (KR): ArknightsAssets/ArknightsGamedata
const DATA_SOURCES: Record<LanguageCode, string> = {
  zh: 'https://raw.githubusercontent.com/Kengxxiao/ArknightsGameData/master/zh_CN/',
  en: 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/en/',
  ja: 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/jp/',
  ko: 'https://raw.githubusercontent.com/ArknightsAssets/ArknightsGamedata/master/kr/'
};

// In-memory caches to avoid redundant HTTP requests
const tableCache = new Map<LanguageCode, RawStoryReviewTable>();
const scriptCache = new Map<string, string>();

/**
 * Returns the base URL for the given language.
 */
export function getRawBaseUrl(language: LanguageCode): string {
  return DATA_SOURCES[language] || DATA_SOURCES.en;
}

/**
 * Fetches story_review_table.json for the specified language.
 * Uses in-memory cache and sessionStorage when available.
 */
export async function fetchStoryReviewTable(language: LanguageCode): Promise<RawStoryReviewTable> {
  // 1. Check in-memory cache
  if (tableCache.has(language)) {
    return tableCache.get(language)!;
  }

  // 2. Check sessionStorage
  const sessionKey = `ark_story_table_${language}`;
  try {
    const cached = sessionStorage.getItem(sessionKey);
    if (cached) {
      const parsed = JSON.parse(cached) as RawStoryReviewTable;
      tableCache.set(language, parsed);
      return parsed;
    }
  } catch {
    // Ignore storage quota or security errors
  }

  // 3. Network fetch
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
    // Ignore storage quota errors
  }

  return data;
}

/**
 * Fetches raw script text for a specific storyTxt path and language.
 */
export async function fetchStoryScriptRaw(language: LanguageCode, storyTxt: string): Promise<string> {
  // Clean up key format (e.g., remove leading slash or trailing .txt)
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
