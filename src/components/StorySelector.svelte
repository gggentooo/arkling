<script lang="ts">
  import { onMount } from 'svelte';
  import { STORY_CATEGORIES, storySelectorState } from '../lib/state/storySelectorState.svelte';
  import { learningState } from '../lib/state/learningState.svelte';
  import { UI_TRANSLATIONS } from '../lib/constants';
  import type { StoryCategory } from '../types';

  let skipLineInput = $state(1);
  let isRestoringSelection = $state(true);

  const t = $derived(
    UI_TRANSLATIONS[learningState.systemLanguage] || UI_TRANSLATIONS['en']
  );

  onMount(async () => {
    await storySelectorState.loadStoryTable(learningState.systemLanguage);

    const params = new URLSearchParams(window.location.search);
    const categoryIndex = parseQueryIndex(params.get('cat'));
    const category = categoryIndex === null ? undefined : STORY_CATEGORIES[categoryIndex];
    if (category && storySelectorState.chaptersByCategory[category.value].length > 0) {
      storySelectorState.selectedCategory = category.value;
    }

    const chapters = storySelectorState.chapters;
    const chapterIndex = parseQueryIndex(params.get('chap'));
    const chapter = chapters[chapterIndex ?? 0] || chapters[0];
    if (chapter) {
      storySelectorState.selectedChapterId = chapter.id;
    }

    const episodes = storySelectorState.episodes;
    const episodeIndex = parseQueryIndex(params.get('ep'));
    const episode = episodes[episodeIndex ?? 0] || episodes[0];
    if (episode) {
      storySelectorState.selectedEpisodeId = episode.storyId;
    }

    await storySelectorState.loadCurrentEpisode(
      learningState.targetLanguage,
      learningState.systemLanguage
    );
    isRestoringSelection = false;
  });

  $effect(() => {
    if (isRestoringSelection) return;

    const categoryIndex = STORY_CATEGORIES.findIndex(
      (category) => category.value === storySelectorState.selectedCategory
    );
    const chapterIndex = storySelectorState.chapters.findIndex(
      (chapter) => chapter.id === storySelectorState.selectedChapterId
    );
    const episodeIndex = storySelectorState.episodes.findIndex(
      (episode) => episode.storyId === storySelectorState.selectedEpisodeId
    );
    if (categoryIndex < 0 || chapterIndex < 0 || episodeIndex < 0) return;

    const url = new URL(window.location.href);
    url.searchParams.set('cat', String(categoryIndex));
    url.searchParams.set('chap', String(chapterIndex));
    url.searchParams.set('ep', String(episodeIndex));
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  });

  function parseQueryIndex(value: string | null): number | null {
    if (value === null || !/^\d+$/.test(value)) return null;
    const index = Number(value);
    return Number.isSafeInteger(index) ? index : null;
  }

  function handleCategoryChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    storySelectorState.setCategory(
      target.value as StoryCategory,
      learningState.targetLanguage,
      learningState.systemLanguage
    );
  }

  function handleChapterChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    storySelectorState.setChapter(
      target.value,
      learningState.targetLanguage,
      learningState.systemLanguage
    );
  }

  function handleEpisodeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    storySelectorState.setEpisode(
      target.value,
      learningState.targetLanguage,
      learningState.systemLanguage
    );
  }

  function handleSkipToLine() {
    const lineNum = parseInt(String(skipLineInput), 10);
    if (isNaN(lineNum)) return;
    const rows = document.querySelectorAll('.index-num');
    const targetRow = rows[lineNum - 1];
    if (targetRow) {
      targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
</script>

<section class="story-selector-card" aria-label="Story Selector">
  <div class="selector-header">
    <div class="header-left">
      <h3 class="selector-title">{t.selectEpisode}</h3>
    </div>

    <!-- Quick Navigation Prev / Next Buttons -->
    <div class="nav-button-group">
      <button
        type="button"
        class="nav-btn"
        disabled={!storySelectorState.hasPrevious || storySelectorState.isLoadingScript}
        onclick={() =>
          storySelectorState.goToPreviousEpisode(
            learningState.targetLanguage,
            learningState.systemLanguage
          )}
        title="Previous Episode"
      >
        <span class="arrow-icon">◀</span> {t.prev}
      </button>

      <span class="episode-counter">
        {storySelectorState.currentIndex + 1} / {storySelectorState.episodes.length || 1}
      </span>

      <button
        type="button"
        class="nav-btn"
        disabled={!storySelectorState.hasNext || storySelectorState.isLoadingScript}
        onclick={() =>
          storySelectorState.goToNextEpisode(
            learningState.targetLanguage,
            learningState.systemLanguage
          )}
        title="Next Episode"
      >
        {t.next} <span class="arrow-icon">▶</span>
      </button>
    </div>
  </div>

  <!-- Three Dropdowns Grid: Category, Chapter, Episode -->
  <div class="dropdowns-grid">
    <!-- 1. Category Dropdown -->
    <div class="selector-item">
      <label for="category-select" class="selector-label">{t.category}</label>
      <div class="select-wrapper">
        <select
          id="category-select"
          value={storySelectorState.selectedCategory}
          onchange={handleCategoryChange}
          disabled={storySelectorState.isLoadingScript}
        >
          {#each STORY_CATEGORIES as cat}
            <option value={cat.value}>{cat.label}</option>
          {/each}
        </select>
        <span class="dropdown-chevron" aria-hidden="true">▾</span>
      </div>
    </div>

    <!-- 2. Chapter Dropdown -->
    <div class="selector-item">
      <label for="chapter-select" class="selector-label">{t.chapter}</label>
      <div class="select-wrapper">
        <select
          id="chapter-select"
          value={storySelectorState.selectedChapterId}
          onchange={handleChapterChange}
          disabled={storySelectorState.isLoadingScript || storySelectorState.chapters.length === 0}
        >
          {#each storySelectorState.chapters as chapter}
            <option value={chapter.id}>{chapter.name}</option>
          {/each}
        </select>
        <span class="dropdown-chevron" aria-hidden="true">▾</span>
      </div>
    </div>

    <!-- 3. Episode Dropdown -->
    <div class="selector-item">
      <label for="episode-select" class="selector-label">{t.episode}</label>
      <div class="select-wrapper">
        <select
          id="episode-select"
          value={storySelectorState.selectedEpisodeId}
          onchange={handleEpisodeChange}
          disabled={storySelectorState.isLoadingScript || storySelectorState.episodes.length === 0}
        >
          {#each storySelectorState.episodes as ep}
            <option value={ep.storyId}>{ep.displayName}</option>
          {/each}
        </select>
        <span class="dropdown-chevron" aria-hidden="true">▾</span>
      </div>
    </div>
  </div>

  <!-- Skip to Line Field -->
  <div class="skip-to-line-container" style="margin-top: 1rem; display: flex; align-items: center; gap: 0.75rem;">
    <label for="skip-line-input" class="selector-label">{t.skipToLine}</label>
    <div style="display: flex; gap: 0.5rem; align-items: center;">
      <input
        type="number"
        id="skip-line-input"
        min="1"
        max={learningState.lines.length || 1}
        bind:value={skipLineInput}
        style="width: 80px;"
      />
      <button type="button" onclick={handleSkipToLine}>{t.skip}</button>
    </div>
  </div>

  <!-- Status / Loading Indicators -->
  {#if storySelectorState.isLoadingScript || storySelectorState.isLoadingTable}
    <div class="status-banner loading-banner" role="status">
      <span class="spinner" aria-hidden="true"></span>
      <span class="status-text">
        {storySelectorState.statusMessage || (storySelectorState.isLoadingTable ? 'Loading story index...' : 'Retrieving script from GitHub...')}
      </span>
    </div>
  {:else if storySelectorState.errorMessage}
    <div class="status-banner error-banner" role="alert">
      <span class="alert-icon">⚠</span>
      <span class="status-text">{storySelectorState.errorMessage}</span>
    </div>
  {/if}
</section>


<style>
  .story-selector-card {
    background-color: var(--bg-surface);
    border: 3px double var(--border-subtle);
    border-radius: var(--border-radius-lg);
    padding: 1.25rem 1.75rem;
    box-shadow: var(--shadow-sm);
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 1.25rem;
  }

  .selector-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .selector-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.01em;
  }

  .nav-button-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: var(--border-radius-sm);
    background-color: var(--bg-surface-subtle);
    border: 1px solid var(--border-subtle);
    color: var(--text-main);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .nav-btn:hover:not(:disabled) {
    background-color: var(--bg-surface-hover);
    border-color: var(--border-strong);
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .arrow-icon {
    font-size: 0.7rem;
  }

  .episode-counter {
    font-size: 0.75rem;
    font-family: var(--font-mono);
    color: var(--text-muted);
    padding: 0 0.35rem;
  }

  .dropdowns-grid {
    display: flex;
    flex-direction: row;
    gap: 1.25rem;
  }

  .selector-item {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .selector-label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  select {
    width: 100%;
    appearance: none;
    background-color: var(--bg-surface-subtle);
    border: 1px solid var(--border-subtle);
    border-radius: var(--border-radius-sm);
    padding: 0.55rem 2rem 0.55rem 0.75rem;
    color: var(--text-main);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-overflow: ellipsis;
    height: 2.5rem;
  }

  select:hover:not(:disabled) {
    border-color: var(--border-strong);
    background-color: var(--bg-surface-hover);
  }

  select:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  select:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .dropdown-chevron {
    position: absolute;
    right: 0.65rem;
    pointer-events: none;
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  .status-banner {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.65rem 0.9rem;
    border-radius: var(--border-radius-sm);
    font-size: 0.85rem;
  }

  .loading-banner {
    background-color: var(--arkling-primary-light);
    border: 1px solid var(--arkling-primary-border);
    color: var(--arkling-primary);
  }

  .error-banner {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--arkling-primary-border);
    border-top-color: var(--arkling-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
  .dropdowns-grid {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-left {
    height: 2rem;
  }

    .story-selector-card {
      padding: 1rem;
      max-width: 100%;
    }
    .selector-header {
      flex-direction: column;
      align-items: stretch;
    }
    .nav-button-group {
      justify-content: space-between;
    }

    select {
        max-width: 100%;
        font-size: 0.75em;
    }
  }
</style>
