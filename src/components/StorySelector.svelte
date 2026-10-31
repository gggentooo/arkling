<script lang="ts">
  import {onMount} from 'svelte';
  import {STORY_CATEGORIES, storySelectorState} from '../lib/state/storySelectorState.svelte';
  import {learningState} from '../lib/state/learningState.svelte';
  import {UI_TRANSLATIONS} from '../lib/constants';
  import type {StoryCategory} from '../types';

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
      targetRow.scrollIntoView({behavior: 'smooth', block: 'center'});
    }
  }
</script>

<section class="story-selector-card" aria-label="Story Selector">
  <div class="selector-header">
    <div class="header-left">
      <h3 class="selector-title">{t.selectEpisode}</h3>
    </div>

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

  <div class="dropdowns-grid">
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

  <div class="skip-to-line-container">
    <label for="skip-line-input" class="selector-label">{t.skipToLine}</label>
    <div class="skip-to-line-controls">
      <input
          type="number"
          id="skip-line-input"
          min="1"
          max={learningState.lines.length || 1}
          bind:value={skipLineInput}
      />
      <button type="button" onclick={handleSkipToLine}>{t.skip}</button>
    </div>
  </div>

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
