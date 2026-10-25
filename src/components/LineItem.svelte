<script lang="ts">
  import type { LanguageCode, ScriptLine } from '../types';
  import { learningState } from '../lib/state/learningState.svelte';

  interface Props {
    line: ScriptLine;
    language: LanguageCode;
    variant?: 'target' | 'system' | 'default';
    interactive?: boolean;
    isRevealed?: boolean;
    onclick?: () => void;
  }

  let {
    line,
    language,
    variant = 'default',
    interactive = false,
    isRevealed = false,
    onclick
  }: Props = $props();

  const speaker = $derived(line.speaker?.[language] || line.speaker?.['en'] || '');
  
  // When target language annotations are active, render the annotated HTML
  const content = $derived.by(() => {
    if (variant === 'target') {
      if (language === 'zh' && learningState.displayPinyin && line.annotatedText?.zh) {
        return line.annotatedText.zh;
      }
      if (
        language === 'ja' &&
        learningState.japaneseAnnotationMode !== 'none' &&
        line.annotatedText?.ja
      ) {
        return line.annotatedText.ja;
      }
    }
    return line.text[language] || line.text['en'] || '';
  });
</script>

{#if interactive}
  <button
    type="button"
    class="line-item variant-{variant} interactive"
    class:revealed={isRevealed}
    {onclick}
  >
    {#if speaker}
      <div class="line-speaker">
        <span class="speaker-tag">{speaker}</span>
      </div>
    {/if}

    <div class="line-body">
      <p class="line-text" lang={language}>
        {@html content}
      </p>
    </div>
  </button>
{:else}
  <div class="line-item variant-{variant}">
    {#if speaker}
      <div class="line-speaker">
        <span class="speaker-tag">{speaker}</span>
      </div>
    {/if}

    <div class="line-body">
      <p class="line-text" lang={language}>
        {@html content}
      </p>
    </div>
  </div>
{/if}

<style>
  .line-item {
    width: 100%;
    padding: 0.9rem 1.15rem;
    border-radius: var(--border-radius-md);
    background-color: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    transition: all var(--transition-fast);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    position: relative;
    text-align: left;
    box-sizing: border-box;
  }

  button.line-item {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    line-height: inherit;    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    
    cursor: text;
  }

  .interactive:hover {
    border-color: var(--border-strong);
    background-color: var(--bg-surface-subtle);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
  }

  .interactive:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }

  .variant-target {
    border-left: 3px solid var(--arkling-target);
  }

  .variant-system {
    border-left: 3px solid var(--arkling-system);
    background-color: var(--bg-surface-subtle);
  }

  .line-speaker {
    display: flex;
    align-items: center;
  }

  .speaker-tag {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
    background-color: var(--bg-surface-hover);
    padding: 0.15rem 0.5rem;
    border-radius: var(--border-radius-sm);
  }

  .line-body {
    position: relative;
  }

  .line-text {
    font-size: 1.05rem;
    line-height: 1.8;
    color: var(--text-main);
    word-break: break-word;
    margin: 0;
  }

  /* Specific CJK font sizing adjustments */
  .line-text:lang(zh),
  .line-text:lang(ja) {
    font-size: 1.15rem;
    letter-spacing: 0.03em;
  }

  .line-text:lang(ko) {
    font-size: 1.08rem;
    letter-spacing: 0.01em;
  }
  
  .variant-system>.line-body>.line-text {
  font-size: 0.9em;
}

  /* Ruby annotations formatting */
  .line-text :global(ruby) {
    ruby-position: over;
    ruby-align: center;
  }

  .line-text :global(rt) {
    font-size: 0.58em;
    font-weight: 600;
    color: var(--arkling-target);
    line-height: 1;
    user-select: none;
    letter-spacing: normal;
  }

  .line-text :global(.py-pinyin-item) {
    font-family: var(--font-sans);
    font-size: 0.55em;
    font-weight: 600;
    color: var(--arkling-target);
  }
</style>
