<script lang="ts">
  import { LANGUAGES } from "../lib/constants";
  import { learningState } from "../lib/state/learningState.svelte";
  import LineItem from "./LineItem.svelte";

  const targetLangInfo = $derived(
    LANGUAGES.find((l) => l.code === learningState.targetLanguage),
  );

  const systemLangInfo = $derived(
    LANGUAGES.find((l) => l.code === learningState.systemLanguage),
  );
</script>

<div class="focused-container">
  <!-- Focused Header & Toolbar -->
  <div class="focused-header">
    <div class="header-left">
      <div class="title-meta">
        <span class="badge badge-target">Focused Mode</span>
        <h2 class="view-heading">
          {targetLangInfo?.label}
          <span class="native-name">({targetLangInfo?.nativeLabel})</span>
        </h2>
      </div>
      <p class="view-instruction">
        Lines are displayed in the target language. Click any line to toggle its {systemLangInfo?.label}
        translation.
      </p>
    </div>

    <div class="quick-actions">
      <button
        class="action-btn"
        onclick={() => learningState.revealAllLines()}
        type="button"
        title="Reveal translations for all lines"
        >Reveal All
      </button>
      <button
        class="action-btn"
        onclick={() => learningState.hideAllLines()}
        type="button"
        title="Hide all translations"
        >Hide All
      </button>
    </div>
  </div>

  <!-- Focused Lines List -->
  <div class="focused-lines-list">
    {#each learningState.lines as line, index (line.id)}
      {@const isRevealed = learningState.isLineRevealed(line.id)}
      <div class="focused-line-card" class:revealed={isRevealed}>
        <!-- Top: Target Language Line (Clickable) -->
        <div class="target-line-wrapper">
          <div class="line-index-col">
            <span class="index-num">{index + 1}</span>
            <span class="toggle-indicator" aria-hidden="true">
              {isRevealed ? "▼" : "▶"}
            </span>
          </div>

          <div class="line-interactive-area">
            <LineItem
              {line}
              language={learningState.targetLanguage}
              variant="target"
              interactive={true}
              {isRevealed}
              onclick={() => learningState.toggleLineReveal(line.id)}
            />

            <div class="toggle-prompt">
              {isRevealed
                ? `Click to hide ${systemLangInfo?.label} translation`
                : `Click to reveal ${systemLangInfo?.label} translation`}
            </div>
          </div>
        </div>

        <!-- Bottom: System Language Translation (Revealed on click) -->
        {#if isRevealed}
          <div class="revealed-translation">
            <div class="translation-gutter">
              <span class="gutter-branch" aria-hidden="true">↳</span>
            </div>
            <div class="translation-content">
              <LineItem
                {line}
                language={learningState.systemLanguage}
                variant="system"
              />
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  .focused-container {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: --max-content-width;
    margin: 0 auto;
    width: 100%;
  }

  .focused-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-top: 3px solid var(--arkling-target);
    flex-wrap: wrap;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
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

  .view-heading {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-main);
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }

  .native-name {
    font-size: 0.9rem;
    font-weight: normal;
    color: var(--text-muted);
  }

  .view-instruction {
    font-size: 0.85rem;
    color: var(--text-muted);
  }

  .quick-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.35rem 0.75rem;
    font-size: 0.8rem;
    font-weight: 600;
    border-radius: var(--border-radius-sm);
    background-color: var(--bg-surface-subtle);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .action-btn:hover {
    background-color: var(--bg-surface-hover);
    color: var(--text-main);
    border-color: var(--border-strong);
  }

  .focused-lines-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .focused-line-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: var(--border-radius-md);
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    transition: all var(--transition-fast);
  }

  .focused-line-card.revealed {
    border-color: var(--border-strong);
    box-shadow: var(--shadow-sm);
  }

  .target-line-wrapper {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .line-index-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
    padding-top: 0.9rem;
    color: var(--text-subtle);
    font-family: var(--font-mono);
    user-select: none;
  }

  .index-num {
    font-size: 0.75rem;
  }

  .toggle-indicator {
    font-size: 0.65rem;
    color: var(--arkling-primary);
  }

  .line-interactive-area {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .toggle-prompt {
    font-size: 0.7rem;
    color: var(--text-subtle);
    padding-left: 0.5rem;
    user-select: none;
    transition: color var(--transition-fast);
  }

  .focused-line-card:hover .toggle-prompt {
    color: var(--arkling-primary);
  }

  .revealed-translation {
    display: grid;
    grid-template-columns: 2.5rem 1fr;
    gap: 0.5rem;
    margin-top: 0.25rem;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--border-subtle);
  }

  .translation-gutter {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--arkling-system);
    font-size: 1rem;
    user-select: none;
  }

  .gutter-branch {
    font-weight: 700;
  }

  .translation-content {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 768px) {
    .focused-header {
      flex-direction: column;
      align-items: stretch;
    }
    .quick-actions {
      justify-content: flex-end;
    }
  }
</style>
