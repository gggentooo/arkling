<script lang="ts">
  import { onMount } from 'svelte';
  import { STORY_CATEGORIES, storySelectorState } from '../lib/state/storySelectorState.svelte';
  import { learningState } from '../lib/state/learningState.svelte';
  import type { StoryCategory } from '../types';

  onMount(() => {
    // Initial fetch of review table and default prologue script
    storySelectorState.init(learningState.systemLanguage, learningState.targetLanguage);
  });

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
</script>

<section class="story-selector-card" aria-label="Story Selector">
  <div class="selector-header">
    <div class="header-left">
      <h3 class="selector-title">Select Episode:</h3>
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
        <span class="arrow-icon">◀</span> Prev
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
        Next <span class="arrow-icon">▶</span>
      </button>
    </div>
  </div>

  <!-- Three Dropdowns Grid: Category, Chapter, Episode -->
  <div class="dropdowns-grid">
    <!-- 1. Category Dropdown -->
    <div class="selector-item">
      <label for="category-select" class="selector-label">Category</label>
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
      <label for="chapter-select" class="selector-label">Chapter</label>
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
      <label for="episode-select" class="selector-label">Episode</label>
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
    }
  }
</style>
