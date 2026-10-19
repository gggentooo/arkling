<script lang="ts">
  import { learningState } from '../lib/state/learningState.svelte';
  import { storySelectorState } from '../lib/state/storySelectorState.svelte';
  import StorySelector from './StorySelector.svelte';
  import SideBySideView from './SideBySideView.svelte';
  import FocusedView from './FocusedView.svelte';

  const categoryLabel = $derived(
    storySelectorState.selectedCategory === 'main'
      ? 'Main Story'
      : storySelectorState.selectedCategory === 'side'
        ? 'Side Story'
        : storySelectorState.selectedCategory === 'mini'
          ? 'Vignette'
          : 'Operator Record'
  );
</script>

<main class="main-area">
  <div class="main-container">
    <!-- Additional section right above script-header: Category, Chapter, Episode Dropdowns -->
    <StorySelector />

    <!-- Reading Canvas (Mode-dependent) -->
    <section class="script-content">
      {#if learningState.lines.length === 0 && storySelectorState.isLoadingScript}
        <div class="empty-state">
          <span class="empty-spinner"></span>
          <p>Retrieving and aligning multilingual scripts from GitHub...</p>
        </div>
      {:else if learningState.learningMode === 'side-by-side'}
        <SideBySideView />
      {:else}
        <FocusedView />
      {/if}
    </section>
  </div>
</main>

<style>
  .main-area {
    flex: 1;
    padding: 1.5rem 1.5rem 4rem;
    background-color: var(--bg-app);
  }

  .main-container {
    max-width: var(--max-content-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .script-header {
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: var(--border-radius-lg);
    padding: 1.5rem 1.75rem;
    box-shadow: var(--shadow-sm);
  }

  .script-meta {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .script-title {
    font-size: 1.45rem;
    font-weight: 700;
    color: var(--text-main);
    letter-spacing: -0.02em;
    line-height: 1.3;
  }

  .script-description {
    font-size: 0.9rem;
    color: var(--text-muted);
    max-width: 800px;
    line-height: 1.5;
  }

  .tag-highlight {
    font-weight: 600;
    color: var(--arkling-target);
  }

  .script-content {
    display: flex;
    flex-direction: column;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    background-color: var(--bg-surface);
    border: 1px dashed var(--border-strong);
    border-radius: var(--border-radius-lg);
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  .empty-spinner {
    width: 24px;
    height: 24px;
    border: 3px solid var(--border-subtle);
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
    .main-area {
      padding: 1rem 0.75rem 3rem;
    }

    .script-header {
      padding: 1.25rem 1rem;
    }

    .script-title {
      font-size: 1.25rem;
    }
  }
</style>
