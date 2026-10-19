declare module 'kuroshiro' {
  export interface ConvertOptions {
    to?: 'hiragana' | 'katakana' | 'romaji';
    mode?: 'normal' | 'spaced' | 'okurigana' | 'furigana';
    romajiSystem?: 'nippon' | 'passport' | 'hepburn';
    delimiter_start?: string;
    delimiter_end?: string;
  }

  export default class Kuroshiro {
    constructor();
    init(analyzer: unknown): Promise<void>;
    convert(str: string, options?: ConvertOptions): Promise<string>;
    static Util: {
      isHiragana(str: string): boolean;
      isKatakana(str: string): boolean;
      isKana(str: string): boolean;
      isKanji(str: string): boolean;
      isJapanese(str: string): boolean;
      hasHiragana(str: string): boolean;
      hasKatakana(str: string): boolean;
      hasKana(str: string): boolean;
      hasKanji(str: string): boolean;
      hasJapanese(str: string): boolean;
      kanaToHiragana(str: string): string;
      kanaToKatakana(str: string): string;
      kanaToRomaji(str: string, system?: string): string;
    };
  }
}

declare module 'kuroshiro-analyzer-kuromoji' {
  export interface AnalyzerOptions {
    dictPath?: string;
  }

  export default class KuromojiAnalyzer {
    constructor(options?: AnalyzerOptions);
    init(): Promise<void>;
    parse(str?: string): Promise<unknown[]>;
  }
}
