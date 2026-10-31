import {SAMPLE_LINES} from '../constants';
import type {JapaneseAnnotationMode, LanguageCode, LearningMode, ScriptLine} from '../../types';
import {annotateScriptLines} from '../annotations';

class LearningStateManager {
  targetLanguage = $state<LanguageCode>('zh');
  systemLanguage = $state<LanguageCode>('en');
  learningMode = $state<LearningMode>('side-by-side');

  displayPinyin = $state<boolean>(false);
  japaneseAnnotationMode = $state<JapaneseAnnotationMode>('none');
  isAnnotating = $state<boolean>(false);
  private annotationRequestId = 0;

  revealedLineIds = $state<Set<string>>(new Set());

  lines = $state<ScriptLine[]>(SAMPLE_LINES);

  constructor() {
    if (this.targetLanguage === this.systemLanguage) {
      this.systemLanguage = this.findAlternativeLanguage(this.targetLanguage);
    }
  }

  setTargetLanguage(lang: LanguageCode) {
    if (this.targetLanguage === lang) return;
    this.targetLanguage = lang;

    if (this.systemLanguage === lang) {
      this.systemLanguage = this.findAlternativeLanguage(lang);
    }

    this.applyAnnotations();
  }

  setSystemLanguage(lang: LanguageCode) {
    if (lang === this.targetLanguage) {
      return;
    }
    this.systemLanguage = lang;
  }

  setLearningMode(mode: LearningMode) {
    this.learningMode = mode;
  }

  async setDisplayPinyin(enabled: boolean) {
    this.displayPinyin = enabled;
    await this.applyAnnotations();
  }

  async setJapaneseAnnotationMode(mode: JapaneseAnnotationMode) {
    this.japaneseAnnotationMode = mode;
    await this.applyAnnotations();
  }

  async applyAnnotations() {
    const requestId = ++this.annotationRequestId;
    const needsMandarin = this.targetLanguage === 'zh' && this.displayPinyin;
    const needsJapanese = this.targetLanguage === 'ja' && this.japaneseAnnotationMode !== 'none';

    if (!needsMandarin && !needsJapanese) {
      this.isAnnotating = false;
      return;
    }

    this.isAnnotating = true;
    try {
      const updatedLines = await annotateScriptLines(
        this.lines,
        this.targetLanguage,
        this.displayPinyin,
        this.japaneseAnnotationMode
      );
      if (requestId === this.annotationRequestId) {
        this.lines = updatedLines;
      }
    } catch (err) {
      console.error('Failed to generate annotations:', err);
    } finally {
      if (requestId === this.annotationRequestId) {
        this.isAnnotating = false;
      }
    }
  }

  toggleLineReveal(lineId: string) {
    const next = new Set(this.revealedLineIds);
    if (next.has(lineId)) {
      next.delete(lineId);
    } else {
      next.add(lineId);
    }
    this.revealedLineIds = next;
  }

  isLineRevealed(lineId: string): boolean {
    return this.revealedLineIds.has(lineId);
  }

  revealAllLines() {
    this.revealedLineIds = new Set(this.lines.map((l) => l.id));
  }

  hideAllLines() {
    this.revealedLineIds = new Set();
  }

  private findAlternativeLanguage(exclude: LanguageCode): LanguageCode {
    const fallbackOrder: LanguageCode[] = ['en', 'zh', 'ja', 'ko'];
    const found = fallbackOrder.find((c) => c !== exclude);
    return found || 'en';
  }
}

export const learningState = new LearningStateManager();
