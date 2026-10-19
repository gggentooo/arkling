import { html as pinyinHtml } from 'pinyin-pro';
import Kuroshiro from 'kuroshiro';
import KuromojiAnalyzer from 'kuroshiro-analyzer-kuromoji';
import type { JapaneseAnnotationMode, LanguageCode, ScriptLine } from '../../types';

let kuroshiroInstance: Kuroshiro | null = null;
let kuroshiroInitPromise: Promise<Kuroshiro> | null = null;

// In-memory caches for fast instantaneous re-renders
const pinyinCache = new Map<string, string>();
const japaneseCache = new Map<string, string>();

/**
 * Initializes Kuroshiro analyzer with dictPath.
 * First tries the local /dict/ path, and falls back to unpkg/jsdelivr CDN if needed.
 */
export async function getKuroshiro(): Promise<Kuroshiro> {
  if (kuroshiroInstance) {
    return kuroshiroInstance;
  }

  if (kuroshiroInitPromise) {
    return await kuroshiroInitPromise;
  }

  kuroshiroInitPromise = (async () => {
    const KuroshiroCtor = (Kuroshiro as unknown as { default?: typeof Kuroshiro }).default || Kuroshiro;
    const KuromojiCtor =
      (KuromojiAnalyzer as unknown as { default?: typeof KuromojiAnalyzer }).default ||
      KuromojiAnalyzer;

    const kuroshiro = new KuroshiroCtor();

    // In browser/Vite with relative base './', build dictPath relative to current page
    const base = import.meta.env.BASE_URL || './';
    const localDictPath = base.endsWith('/') ? `${base}dict/` : `${base}/dict/`;

    try {
      const analyzer = new KuromojiCtor({
        dictPath: localDictPath
      });
      await kuroshiro.init(analyzer);
      kuroshiroInstance = kuroshiro;
      return kuroshiro;
    } catch (localErr) {
      console.warn('Local kuromoji dictionary loading failed, trying CDN fallback...', localErr);
      const cdnAnalyzer = new KuromojiCtor({
        dictPath: 'https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict/'
      });
      await kuroshiro.init(cdnAnalyzer);
      kuroshiroInstance = kuroshiro;
      return kuroshiro;
    }
  })();

  return await kuroshiroInitPromise;
}

/**
 * Annotates Mandarin Chinese text with Pinyin ruby tags.
 */
export function annotateMandarin(text: string): string {
  if (!text) return '';
  if (pinyinCache.has(text)) {
    return pinyinCache.get(text)!;
  }

  const annotated = pinyinHtml(text);
  pinyinCache.set(text, annotated);
  return annotated;
}

/**
 * Annotates Japanese text with Furigana (ruby tags) or Romaji.
 */
export async function annotateJapanese(
  text: string,
  mode: JapaneseAnnotationMode
): Promise<string> {
  if (!text || mode === 'none') {
    return text;
  }

  const cacheKey = `${mode}:${text}`;
  if (japaneseCache.has(cacheKey)) {
    return japaneseCache.get(cacheKey)!;
  }

  const kuroshiro = await getKuroshiro();

  let result = text;
  if (mode === 'furigana') {
    result = await kuroshiro.convert(text, {
      mode: 'furigana',
      to: 'hiragana'
    });
  } else if (mode === 'romaji') {
    result = await kuroshiro.convert(text, {
      mode: 'furigana',
      to: 'romaji',
      romajiSystem: 'hepburn'
    });
  }

  japaneseCache.set(cacheKey, result);
  return result;
}

/**
 * Applies annotations to an array of ScriptLines based on target language and user settings.
 */
export async function annotateScriptLines(
  lines: ScriptLine[],
  targetLanguage: LanguageCode,
  displayPinyin: boolean,
  japaneseAnnotationMode: JapaneseAnnotationMode
): Promise<ScriptLine[]> {
  if (lines.length === 0) return lines;

  // 1. Mandarin with Pinyin enabled
  if (targetLanguage === 'zh' && displayPinyin) {
    return lines.map((line) => {
      const raw = line.text.zh;
      if (!raw) return line;

      const pinyin = annotateMandarin(raw);
      return {
        ...line,
        annotatedText: {
          ...line.annotatedText,
          zh: pinyin
        }
      };
    });
  }

  // 2. Japanese with Furigana or Romaji enabled
  if (targetLanguage === 'ja' && japaneseAnnotationMode !== 'none') {
    // Process lines in parallel batches for responsive UI
    const annotatedTexts = await Promise.all(
      lines.map((line) => {
        const raw = line.text.ja;
        if (!raw) return Promise.resolve('');
        return annotateJapanese(raw, japaneseAnnotationMode);
      })
    );

    return lines.map((line, idx) => {
      const annotated = annotatedTexts[idx];
      return {
        ...line,
        annotatedText: {
          ...line.annotatedText,
          ja: annotated || line.text.ja
        }
      };
    });
  }

  return lines;
}
