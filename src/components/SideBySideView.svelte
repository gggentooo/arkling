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
            <div class="index-num-container"><span class="index-num">{index + 1}</span></div>
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
  .index-num-container {
    display: flex;
    font-size: 0.75rem;
    min-width: 1rem;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
  }

  .side-by-side-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .lines-grid {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .line-row {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .pane {
    display: flex;
    height: 100%;
    width: 100%;
  }

  @media (max-width: 768px) {
    .line-row {
        flex-direction: column;
      gap: 0.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px dashed var(--border-subtle);
    }
  }
</style>
