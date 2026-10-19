import { SAMPLE_LINES } from '../constants';
import type { JapaneseAnnotationMode, LanguageCode, LearningMode, ScriptLine } from '../../types';
import { annotateScriptLines } from '../annotations';

class LearningStateManager {
  targetLanguage = $state<LanguageCode>('zh');
  systemLanguage = $state<LanguageCode>('en');
  learningMode = $state<LearningMode>('side-by-side');

  // Annotation options
  displayPinyin = $state<boolean>(false);
  japaneseAnnotationMode = $state<JapaneseAnnotationMode>('none');
  isAnnotating = $state<boolean>(false);

  // Set of revealed line IDs for 'focused' mode
  revealedLineIds = $state<Set<string>>(new Set());

  // Script lines
  lines = $state<ScriptLine[]>(SAMPLE_LINES);

  constructor() {
    // Ensure initial state invariants
    if (this.targetLanguage === this.systemLanguage) {
      this.systemLanguage = this.findAlternativeLanguage(this.targetLanguage);
    }
  }

  setTargetLanguage(lang: LanguageCode) {
    if (this.targetLanguage === lang) return;
    this.targetLanguage = lang;

    // Invariant: System language cannot be the same as target language
    if (this.systemLanguage === lang) {
      this.systemLanguage = this.findAlternativeLanguage(lang);
    }

    // Automatically apply annotations if the newly selected target language has them enabled
    this.applyAnnotations();
  }

  setSystemLanguage(lang: LanguageCode) {
    if (lang === this.targetLanguage) {
      return; // Disallow setting system language equal to target language
    }
    this.systemLanguage = lang;
  }

  setLearningMode(mode: LearningMode) {
    this.learningMode = mode;
  }

  setDisplayPinyin(enabled: boolean) {
    this.displayPinyin = enabled;
    this.applyAnnotations();
  }

  setJapaneseAnnotationMode(mode: JapaneseAnnotationMode) {
    this.japaneseAnnotationMode = mode;
    this.applyAnnotations();
  }

  async applyAnnotations() {
    // Check if any annotation is needed for current target language
    const needsMandarin = this.targetLanguage === 'zh' && this.displayPinyin;
    const needsJapanese = this.targetLanguage === 'ja' && this.japaneseAnnotationMode !== 'none';

    if (!needsMandarin && !needsJapanese) {
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
      this.lines = updatedLines;
    } catch (err) {
      console.error('Failed to generate annotations:', err);
    } finally {
      this.isAnnotating = false;
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
