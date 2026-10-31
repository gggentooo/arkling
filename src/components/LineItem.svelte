<script lang="ts">
  import type {LanguageCode, ScriptLine} from '../types';
  import {learningState} from '../lib/state/learningState.svelte';

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
