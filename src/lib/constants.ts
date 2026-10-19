import type { LanguageCode, LanguageOption, LearningMode, ScriptLine } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'zh', label: 'Mandarin', nativeLabel: '中文 (普通话)' },
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어' }
];

export const LEARNING_MODES: { value: LearningMode; label: string; description: string }[] = [
  {
    value: 'side-by-side',
    label: 'Side-by-side',
    description: 'Story is displayed simultaneously in both target and system languages.'
  },
  {
    value: 'focused',
    label: 'Focused',
    description: 'Story is displayed only in target language; click individual lines to toggle system language.'
  }
];
