import type {
  LanguageCode,
  RawStoryReviewTable,
  StoryCategory,
  StoryCategoryOption,
  StoryChapter,
  StoryEpisode
} from '../../types';
import { fetchStoryReviewTable, fetchStoryScriptRaw } from '../api/arknights';
import { parseArknightsScript, alignScripts } from '../parser/scriptParser';
import { learningState } from './learningState.svelte';

export const STORY_CATEGORIES: StoryCategoryOption[] = [
  { value: 'main', label: 'Main Story', description: 'Main Story' },
  { value: 'side', label: 'Side Story', description: 'Side Story' },
  { value: 'mini', label: 'Vignette', description: 'Vignette' },
  { value: 'record', label: 'Operator Record', description: 'Operator Record' }
];

const INITIAL_PROLOGUE_EPISODES: StoryEpisode[] = [
  {
    storyId: 'main_0_0_welcome_to_guide',
    storyGroup: 'main_0',
    storySort: 1,
    storyCode: '',
    storyName: 'Prologue, Part 1',
    storyTxt: 'obt/guide/beg/0_welcome_to_guide',
    avgTag: 'Interlude',
    displayName: 'Prologue, Part 1'
  },
  {
    storyId: 'main_0_0_guide_to_home',
    storyGroup: 'main_0',
    storySort: 2,
    storyCode: '',
    storyName: 'Prologue, Part 2',
    storyTxt: 'obt/guide/beg/2_guide_to_home',
    avgTag: 'Interlude',
    displayName: 'Prologue, Part 2'
  },
  {
    storyId: 'level_main_00-01_beg',
    storyGroup: 'main_0',
    storySort: 3,
    storyCode: '0-1',
    storyName: 'Collapse',
    storyTxt: 'obt/main/level_main_00-01_beg',
    avgTag: 'Before Operation',
    displayName: '0-1 (Before) - Collapse'
  },
  {
    storyId: 'level_main_00-01_end',
    storyGroup: 'main_0',
    storySort: 4,
    storyCode: '0-1',
    storyName: 'Collapse',
    storyTxt: 'obt/main/level_main_00-01_end',
    avgTag: 'After Operation',
    displayName: '0-1 (After) - Collapse'
  }
];

class StorySelectorStateManager {
  selectedCategory = $state<StoryCategory>('main');
  selectedChapterId = $state<string>('main_0');
  selectedEpisodeId = $state<string>('main_0_0_welcome_to_guide');

  chaptersByCategory = $state<Record<StoryCategory, StoryChapter[]>>({
    main: [
      {
        id: 'main_0',
        name: 'Chapter 00 - Evil Time Part 1',
        category: 'main',
        episodes: INITIAL_PROLOGUE_EPISODES
      }
    ],
    side: [],
    mini: [],
    record: []
  });

  isLoadingTable = $state<boolean>(false);
  isLoadingScript = $state<boolean>(false);
  statusMessage = $state<string | null>(null);
  errorMessage = $state<string | null>(null);

  // Derived getters
  chapters = $derived(this.chaptersByCategory[this.selectedCategory] || []);
  
  currentChapter = $derived(
    this.chapters.find((c) => c.id === this.selectedChapterId) || this.chapters[0] || null
  );

  episodes = $derived(this.currentChapter?.episodes || []);

  currentEpisode = $derived(
    this.episodes.find((e) => e.storyId === this.selectedEpisodeId) || this.episodes[0] || null
  );

  currentIndex = $derived(
    this.episodes.findIndex((e) => e.storyId === this.currentEpisode?.storyId)
  );

  hasPrevious = $derived(this.currentIndex > 0);
  hasNext = $derived(this.currentIndex >= 0 && this.currentIndex < this.episodes.length - 1);

  async init(systemLang: LanguageCode, targetLang: LanguageCode) {
    await this.loadStoryTable(systemLang);
    await this.loadCurrentEpisode(targetLang, systemLang);
  }

  async loadStoryTable(lang: LanguageCode) {
    this.isLoadingTable = true;
    this.errorMessage = null;

    try {
      // Fetch review table using system language (or fallback to en/zh)
      let table: RawStoryReviewTable;
      try {
        table = await fetchStoryReviewTable(lang);
      } catch {
        // Fallback to English if system language table fetch fails
        table = await fetchStoryReviewTable('en');
      }

      this.processStoryReviewTable(table);
    } catch (err) {
      console.error('Failed to load story review table:', err);
      this.errorMessage = 'Could not load story index from GitHub. Using default prologue stories.';
    } finally {
      this.isLoadingTable = false;
    }
  }

  private processStoryReviewTable(table: RawStoryReviewTable) {
    const mainChapters: StoryChapter[] = [];
    const sideChapters: StoryChapter[] = [];
    const miniChapters: StoryChapter[] = [];
    const recordChapters: StoryChapter[] = [];

    for (const [key, rawEntry] of Object.entries(table)) {
      if (!rawEntry.infoUnlockDatas || rawEntry.infoUnlockDatas.length === 0) {
        continue;
      }

      const episodes: StoryEpisode[] = rawEntry.infoUnlockDatas
        .filter((d) => Boolean(d.storyTxt))
        .map((d, index) => {
          let displayName = d.storyName || `Episode ${index + 1}`;
          if (d.storyCode) {
            let tagPart = '';
            if (d.avgTag) {
              if (d.avgTag.includes('Before') || d.avgTag.includes('前')) tagPart = ' (Before)';
              else if (d.avgTag.includes('After') || d.avgTag.includes('后')) tagPart = ' (After)';
              else tagPart = ` (${d.avgTag})`;
            }
            displayName = `${d.storyCode}${tagPart} - ${d.storyName}`;
          }

          return {
            storyId: d.storyId || `${key}_ep_${index}`,
            storyGroup: d.storyGroup || key,
            storySort: d.storySort ?? index,
            storyCode: d.storyCode || '',
            storyName: d.storyName || '',
            storyTxt: d.storyTxt,
            avgTag: d.avgTag || '',
            displayName
          };
        });

      episodes.sort((a, b) => a.storySort - b.storySort);

      if (key.startsWith('main_')) {
        const chapterNum = key.split('_')[1] || '0';
        const formattedNum = chapterNum.padStart(2, '0');
        mainChapters.push({
          id: key,
          name: `Chapter ${formattedNum} - ${rawEntry.name}`,
          category: 'main',
          episodes
        });
      } else if (key.startsWith('story_')) {
        recordChapters.push({
          id: key,
          name: rawEntry.name || key,
          category: 'record',
          episodes
        });
      } else if (rawEntry.entryType && rawEntry.entryType.startsWith('MINI_')) {
        miniChapters.push({
          id: key,
          name: rawEntry.name || key,
          category: 'mini',
          episodes
        });
      } else {
        sideChapters.push({
          id: key,
          name: rawEntry.name || key,
          category: 'side',
          episodes
        });
      }
    }

    mainChapters.sort((a, b) => {
      const numA = parseInt(a.id.split('_')[1] || '0', 10);
      const numB = parseInt(b.id.split('_')[1] || '0', 10);
      return numA - numB;
    });

    this.chaptersByCategory = {
      main: mainChapters.length > 0 ? mainChapters : this.chaptersByCategory.main,
      side: sideChapters,
      mini: miniChapters,
      record: recordChapters
    };

    const currentCatChapters = this.chaptersByCategory[this.selectedCategory] || [];
    if (!currentCatChapters.some((c) => c.id === this.selectedChapterId)) {
      this.selectedChapterId = currentCatChapters[0]?.id || 'main_0';
    }

    const currentChapter = currentCatChapters.find((c) => c.id === this.selectedChapterId);
    if (currentChapter && !currentChapter.episodes.some((e) => e.storyId === this.selectedEpisodeId)) {
      this.selectedEpisodeId = currentChapter.episodes[0]?.storyId || '';
    }
  }

  setCategory(cat: StoryCategory, targetLang: LanguageCode, systemLang: LanguageCode) {
    if (this.selectedCategory === cat) return;
    this.selectedCategory = cat;

    const chapters = this.chaptersByCategory[cat] || [];
    if (chapters.length > 0) {
      this.selectedChapterId = chapters[0].id;
      if (chapters[0].episodes.length > 0) {
        this.selectedEpisodeId = chapters[0].episodes[0].storyId;
      }
    }
    this.loadCurrentEpisode(targetLang, systemLang);
  }

  setChapter(chapterId: string, targetLang: LanguageCode, systemLang: LanguageCode) {
    if (this.selectedChapterId === chapterId) return;
    this.selectedChapterId = chapterId;

    const chapter = this.chapters.find((c) => c.id === chapterId);
    if (chapter && chapter.episodes.length > 0) {
      this.selectedEpisodeId = chapter.episodes[0].storyId;
    }
    this.loadCurrentEpisode(targetLang, systemLang);
  }

  setEpisode(episodeId: string, targetLang: LanguageCode, systemLang: LanguageCode) {
    if (this.selectedEpisodeId === episodeId) return;
    this.selectedEpisodeId = episodeId;
    this.loadCurrentEpisode(targetLang, systemLang);
  }

  goToPreviousEpisode(targetLang: LanguageCode, systemLang: LanguageCode) {
    if (this.hasPrevious) {
      const prev = this.episodes[this.currentIndex - 1];
      if (prev) {
        this.setEpisode(prev.storyId, targetLang, systemLang);
      }
    }
  }

  goToNextEpisode(targetLang: LanguageCode, systemLang: LanguageCode) {
    if (this.hasNext) {
      const next = this.episodes[this.currentIndex + 1];
      if (next) {
        this.setEpisode(next.storyId, targetLang, systemLang);
      }
    }
  }

  async loadCurrentEpisode(targetLang: LanguageCode, systemLang: LanguageCode) {
    const episode = this.currentEpisode;
    if (!episode || !episode.storyTxt) return;

    this.isLoadingScript = true;
    this.errorMessage = null;
    this.statusMessage = `Fetching script: ${episode.displayName}...`;

    try {
      let targetRaw = '';
      try {
        targetRaw = await fetchStoryScriptRaw(targetLang, episode.storyTxt);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (errorMsg.includes('STORY_NOT_FOUND_404')) {
          this.errorMessage = `Script "${episode.displayName}" is not yet released on the ${targetLang.toUpperCase()} server.`;
          return;
        }
        throw err;
      }

      let systemRaw = '';
      try {
        systemRaw = await fetchStoryScriptRaw(systemLang, episode.storyTxt);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        if (errorMsg.includes('STORY_NOT_FOUND_404')) {
          this.statusMessage = `Note: Translation is not yet released on the ${systemLang.toUpperCase()} server. Showing target text only.`;
        } else {
          console.warn(`Could not load system language script (${systemLang}):`, err);
        }
      }

      const targetParsed = parseArknightsScript(targetRaw);
      const systemParsed = systemRaw ? parseArknightsScript(systemRaw) : [];

      const alignedLines = alignScripts(targetParsed, systemParsed, targetLang, systemLang);

      learningState.lines = alignedLines;
      learningState.hideAllLines(); // reset revealed lines for focused mode

      await learningState.applyAnnotations();

      this.statusMessage = null;
    } catch (err: unknown) {
      console.error('Failed to load episode script:', err);
      this.errorMessage = `Failed to load script data from GitHub raw content. Please check your connection.`;
    } finally {
      this.isLoadingScript = false;
    }
  }
}

export const storySelectorState = new StorySelectorStateManager();
