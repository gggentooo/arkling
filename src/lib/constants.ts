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

export const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    targetLanguage: 'Target Language',
    systemLanguage: 'System Language',
    learningMode: 'Learning Mode',
    pinyin: 'Pinyin',
    displayPinyin: 'Display Pinyin',
    annotations: 'Annotations',
    noAnnotations: 'No annotations',
    furigana: 'Furigana',
    romaji: 'Romaji',
    closeMenu: 'Close Menu',
    openMenu: 'Open Menu',
    targetSuffix: ' — (Target)',
    selectEpisode: 'Select Episode:',
    prev: 'Prev',
    next: 'Next',
    category: 'Category',
    chapter: 'Chapter',
    episode: 'Episode',
    skipToLine: 'Skip to line:',
    skip: 'Skip'
  },
  zh: {
    targetLanguage: '目标语言',
    systemLanguage: '系统语言',
    learningMode: '学习模式',
    pinyin: '拼音',
    displayPinyin: '显示拼音',
    annotations: '注音标注',
    noAnnotations: '无标注',
    furigana: '振假名 (Furigana)',
    romaji: '罗马字 (Romaji)',
    closeMenu: '关闭菜单',
    openMenu: '打开菜单',
    targetSuffix: ' — (目标语言)',
    selectEpisode: '选择剧集：',
    prev: '上一集',
    next: '下一集',
    category: '类别',
    chapter: '章节',
    episode: '剧集',
    skipToLine: '跳转至行：',
    skip: '跳转'
  },
  ja: {
    targetLanguage: '学習言語',
    systemLanguage: 'システム言語',
    learningMode: '学習モード',
    pinyin: 'ピンイン',
    displayPinyin: 'ピンイン表示',
    annotations: 'ルビ注釈',
    noAnnotations: '注釈なし',
    furigana: 'ふりがな',
    romaji: 'ローマ字',
    closeMenu: 'メニューを閉じる',
    openMenu: 'メニューを開く',
    targetSuffix: ' — (学習言語)',
    selectEpisode: 'エピソードを選択:',
    prev: '前へ',
    next: '次へ',
    category: 'カテゴリ',
    chapter: 'チャプター',
    episode: 'エピソード',
    skipToLine: '指定行へ移動:',
    skip: '移動'
  },
  ko: {
    targetLanguage: '학습 언어',
    systemLanguage: '시스템 언어',
    learningMode: '학습 모드',
    pinyin: '병음',
    displayPinyin: '병음 표시',
    annotations: '주석 표시',
    noAnnotations: '주석 없음',
    furigana: '후리가나',
    romaji: '로마자',
    closeMenu: '메뉴 닫기',
    openMenu: '메뉴 열기',
    targetSuffix: ' — (학습 언어)',
    selectEpisode: '에피소드 선택:',
    prev: '이전',
    next: '다음',
    category: '카테고리',
    chapter: '챕터',
    episode: '에피소드',
    skipToLine: '지정한 줄로 이동:',
    skip: '이동'
  }
};



export const SAMPLE_LINES: ScriptLine[] = [
  {
    id: 'line-1',
    speaker: {
      zh: '旁白',
      en: 'Narrator',
      ja: 'ナレーション',
      ko: '해설'
    },
    text: {
      zh: '夜幕降临，古老王国的废墟在冷冽的月光下显得格外静谧。',
      en: 'Night fell, and the ruins of the ancient kingdom lay quiet beneath the cold moonlight.',
      ja: '夜のとばりが下り、古代王国の廃墟は冷たい月明かりの下で静まり返っていた。',
      ko: '어둠이 내려앉고, 고대 왕국의 폐허는 차가운 달빛 아래 고요에 잠겨 있었다.'
    }
  },
  {
    id: 'line-2',
    speaker: {
      zh: '艾莲娜',
      en: 'Elena',
      ja: 'エレナ',
      ko: '엘레나'
    },
    text: {
      zh: '“我们到了。前面就是藏有星辰核心的神殿之门。”',
      en: '"We have arrived. Ahead lies the temple gate containing the Star Core."',
      ja: '「着いたわ。あの先にあるのが、星の核が眠る神殿の扉よ。」',
      ko: '"도착했어. 저 앞이 바로 별의 핵이 잠들어 있는 신전의 문이야."'
    }
  },
  {
    id: 'line-3',
    speaker: {
      zh: '雷恩',
      en: 'Renn',
      ja: 'レン',
      ko: '렌'
    },
    text: {
      zh: '“门上的古老符文还在发光……小心点，这里可能残留着守护者的防御魔法。”',
      en: '"The ancient runes on the door are still glowing... Stay vigilant, the guardian\'s defense wards might still be active."',
      ja: '「扉の古代ルーンがまだ光っている……気をつけろ、守護者の防衛魔法が残っているかもしれない。」',
      ko: '"문 위의 고대 룬이 아직 빛나고 있어…… 조심해, 수호자의 방어 마법이 남아 있을지도 몰라."'
    }
  },
  {
    id: 'line-4',
    speaker: {
      zh: '艾莲娜',
      en: 'Elena',
      ja: 'エレナ',
      ko: '엘레나'
    },
    text: {
      zh: '“别担心，我已经掌握了解开结印的咒文。只要按照星位排列就能打开它。”',
      en: '"Don\'t worry, I have already decoded the incantation to unbind the seal. Aligning it with the stars will open it."',
      ja: '「心配しないで、封印を解く呪文はもう解読してあるわ。星の配列に合わせれば開くはずよ。」',
      ko: '"걱정 마, 봉인을 푸는 주문은 이미 알아냈어. 별자리의 배열에 맞추면 열릴 거야."'
    }
  },
  {
    id: 'line-5',
    speaker: {
      zh: '系统',
      en: 'System',
      ja: 'システム',
      ko: '시스템'
    },
    text: {
      zh: '【提示】Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      en: '【Notice】Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      ja: '【通知】Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.',
      ko: '【알림】Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'
    }
  },
  {
    id: 'line-6',
    speaker: {
      zh: '雷恩',
      en: 'Renn',
      ja: 'レン',
      ko: '렌'
    },
    text: {
      zh: '“很好，那我来负责警戒四周。无论发生什么，我们一定要拿到核心。”',
      en: '"Understood, I will keep watch on the surroundings. Whatever happens, we must retrieve the core."',
      ja: '「よし、周囲の警戒は俺に任せろ。何があっても、必ず核を手に入れるぞ。」',
      ko: '"좋아, 주변 경계는 내가 맡을게. 무슨 일이 있어도 반드시 핵을 확보해야 해."'
    }
  },
  {
    id: 'line-7',
    speaker: {
      zh: '旁白',
      en: 'Narrator',
      ja: 'ナレーション',
      ko: '해설'
    },
    text: {
      zh: '沉重的石门缓缓滑动，伴随着低沉的轰鸣声，尘封千年的秘密再次重见天日。',
      en: 'With a deep rumbling tremor, the heavy stone gate slowly slid open, revealing secrets sealed away for millennia.',
      ja: '重々しい石扉が鈍い地響きとともにゆっくりと開き、千年の長きにわたり封印されていた秘密が再び光を浴びた。',
      ko: '육중한 석문이 묵직한 굉음과 함께 천천히 열리며, 천 년간 봉인되었던 비밀이 다시 세상의 빛을 보았다.'
    }
  }
];
