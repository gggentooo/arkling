<script lang="ts">
  import { LANGUAGES } from '../lib/constants';
  import { learningState } from '../lib/state/learningState.svelte';
  import LineItem from './LineItem.svelte';

  const targetLangInfo = $derived(
    LANGUAGES.find((l) => l.code === learningState.targetLanguage)
  );

  const systemLangInfo = $derived(
    LANGUAGES.find((l) => l.code === learningState.systemLanguage)
  );
</script>

<div class="side-by-side-container">
  <!-- Text -->
  <div class="lines-grid">
    {#each learningState.lines as line, index (line.id)}
      <div class="line-row">
        <!-- Left: Target Language Area -->
        <div class="pane pane-target">
          <LineItem
            {line}
            language={learningState.targetLanguage}
            variant="target"
          />
        </div>

        <!-- Right: System Language Area -->
        <div class="pane pane-system">
          <LineItem
            {line}
            language={learningState.systemLanguage}
            variant="system"
          />
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .side-by-side-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .column-title-box {
    padding: 1rem 1.25rem;
    border-radius: var(--border-radius-md);
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    width: fit-content;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .target-title-box {
    border-top: 3px solid var(--arkling-target);
  }

  .system-title-box {
    border-top: 3px solid var(--arkling-system);
  }

  .title-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .badge {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.2rem 0.5rem;
    border-radius: var(--border-radius-sm);
  }

  .badge-target {
    background-color: var(--arkling-target-bg);
    color: var(--arkling-target);
  }

  .badge-system {
    background-color: var(--arkling-system-bg);
    color: var(--arkling-system);
  }

  .column-heading {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text-main);
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }

  .native-name {
    font-size: 0.85rem;
    font-weight: normal;
    color: var(--text-muted);
  }

  .lines-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .line-row {
    display: flex;
    gap: 1rem;
    align-items: stretch;
  }

  .pane {
    display: flex;
    height: 100%;
    width: 100%;
  }

  @media (max-width: 860px) {
    .columns-header {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    .line-row {
      grid-template-columns: 1fr;
      gap: 0.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px dashed var(--border-subtle);
    }

    .row-index {
      justify-content: flex-start;
      padding-left: 0.25rem;
    }
  }
</style>
