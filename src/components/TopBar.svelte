<script lang="ts">
  import { LANGUAGES, LEARNING_MODES } from '../lib/constants';
  import { learningState } from '../lib/state/learningState.svelte';
  import { storySelectorState } from '../lib/state/storySelectorState.svelte';
  import type { JapaneseAnnotationMode, LanguageCode, LearningMode } from '../types';

  function handleTargetLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    learningState.setTargetLanguage(select.value as LanguageCode);
    storySelectorState.loadCurrentEpisode(
      learningState.targetLanguage,
      learningState.systemLanguage
    );
  }

function handleSystemLanguageChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const newSystemLang = select.value as LanguageCode;
    learningState.setSystemLanguage(newSystemLang);
    storySelectorState.init(newSystemLang, learningState.targetLanguage);
  }

  function handleLearningModeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    learningState.setLearningMode(select.value as LearningMode);
  }

  function handlePinyinToggle(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    learningState.setDisplayPinyin(checkbox.checked);
  }

  function handleJapaneseAnnotationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    learningState.setJapaneseAnnotationMode(select.value as JapaneseAnnotationMode);
  }

  function sectionOpenClose(button) {
  const parent = button.parentElement;
  const isFolded = button.textContent === 'Close Menu';
  button.textContent = isFolded ? 'Open Menu' : 'Close Menu';
  
  Array.from(parent.children).forEach(child => {
    if (child !== button) {
      child.classList.toggle('hide');
    }
  });
}
</script>

<header class="top-bar">
  <div class="top-bar-inner">
    <!-- arkling / Title -->
    <div class="arkling">
      <div class="arkling-info">
        <h1 class="arkling-title">ArkLing</h1>
        <a href="https://github.com/gggentooo/arkling" class="arkling-subtitle">Source (GitHub)</a>
      </div>
    </div>

    <!-- Controls Container -->
    <div class="controls-group">
<button class="hide" id="button_menu_toggle" onclick={(e) => sectionOpenClose(e.currentTarget)}>Close Menu</button>
      <!-- 1. Target Language Dropdown -->
      <div class="control-item">
        <label for="target-language-select" class="control-label">
          Target Language
        </label>
        <div class="select-wrapper">
          <select
            id="target-language-select"
            value={learningState.targetLanguage}
            onchange={handleTargetLanguageChange}
            aria-label="Target Language (to learn)"
          >
            {#each LANGUAGES as lang}
              <option value={lang.code}>
                {lang.label} ({lang.nativeLabel})
              </option>
            {/each}
          </select>
          <span class="dropdown-chevron" aria-hidden="true">▾</span>
        </div>
      </div>

      <!-- 2. System Language Dropdown -->
      <div class="control-item">
        <label for="system-language-select" class="control-label">
          System Language
        </label>
        <div class="select-wrapper">
          <select
            id="system-language-select"
            value={learningState.systemLanguage}
            onchange={handleSystemLanguageChange}
            aria-label="System Language (for translations)"
          >
            {#each LANGUAGES as lang}
              <option
                value={lang.code}
                disabled={lang.code === learningState.targetLanguage}
                class:disabled-option={lang.code === learningState.targetLanguage}
              >
                {lang.label} ({lang.nativeLabel})
                {lang.code === learningState.targetLanguage ? ' — (Target)' : ''}
              </option>
            {/each}
          </select>
          <span class="dropdown-chevron" aria-hidden="true">▾</span>
        </div>
      </div>

      <!-- 3. Learning Mode Dropdown -->
      <div class="control-item">
        <label for="learning-mode-select" class="control-label">
          Learning Mode
        </label>
        <div class="select-wrapper">
          <select
            id="learning-mode-select"
            value={learningState.learningMode}
            onchange={handleLearningModeChange}
            aria-label="Learning Mode"
          >
            {#each LEARNING_MODES as mode}
              <option value={mode.value}>
                {mode.label}
              </option>
            {/each}
          </select>
          <span class="dropdown-chevron" aria-hidden="true">▾</span>
        </div>
      </div>

      <!-- 4. Language-specific Annotations Control -->
      {#if learningState.targetLanguage === 'zh'}
        <!-- Mandarin: Display Pinyin Checkbox -->
        <div class="control-item checkbox-control-item">
          <span class="control-label">
            Pinyin
          </span>
          <label class="checkbox-container" for="display-pinyin-checkbox">
            <input
              type="checkbox"
              id="display-pinyin-checkbox"
              checked={learningState.displayPinyin}
              onchange={handlePinyinToggle}
            />
            <span class="custom-checkbox" aria-hidden="true">
              {#if learningState.displayPinyin}
                <svg viewBox="0 0 14 14" class="check-icon">
                  <path
                    d="M3 7.5L5.5 10L11 3.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              {/if}
            </span>
            <span class="checkbox-title">Display Pinyin</span>
          </label>
        </div>
      {:else if learningState.targetLanguage === 'ja'}
        <!-- Japanese: Annotations Dropdown (No annotations / Furigana / Romaji) -->
        <div class="control-item">
          <label for="japanese-annotations-select" class="control-label">
            Annotations
            {#if learningState.isAnnotating}
              <span class="mini-spinner" title="Generating Japanese annotations..."></span>
            {/if}
          </label>
          <div class="select-wrapper">
            <select
              id="japanese-annotations-select"
              value={learningState.japaneseAnnotationMode}
              onchange={handleJapaneseAnnotationChange}
              disabled={learningState.isAnnotating}
              aria-label="Annotations"
            >
              <option value="none">No annotations</option>
              <option value="furigana">Furigana</option>
              <option value="romaji">Romaji</option>
            </select>
            <span class="dropdown-chevron" aria-hidden="true">▾</span>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .top-bar {
    position: sticky;
    top: 0;
    z-index: 50;
    background-color: var(--bg-surface);
    border-bottom: 1px solid var(--border-subtle);
  }

  .top-bar-inner {
    max-width: var(--max-content-width);
    margin: 0 auto;
    padding: 0.75rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .arkling {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    user-select: none;
  }

  .arkling-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }

  .arkling-title {
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text-main);
  }

  .arkling-subtitle {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .controls-group {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }

  .control-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .control-label {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .select-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  select {
    appearance: none;
    background-color: var(--bg-surface-subtle);
    border: 1px solid var(--border-subtle);
    border-radius: var(--border-radius-sm);
    padding: 0.45rem 2rem 0.45rem 0.75rem;
    color: var(--text-main);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    min-width: 160px;
    height: 2.5rem;
  }

  select:hover {
    border-color: var(--border-strong);
    background-color: var(--bg-surface-hover);
  }

  select:focus-visible {
    outline: none;
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  .dropdown-chevron {
    position: absolute;
    right: 0.65rem;
    pointer-events: none;
    color: var(--text-muted);
    font-size: 0.75rem;
  }

  option:disabled,
  .disabled-option {
    color: var(--text-disabled) !important;
    background-color: var(--bg-surface-subtle) !important;
    font-style: italic;
  }

  /* Mandarin Pinyin Checkbox Styling */
  .checkbox-control-item {
    justify-content: flex-end;
  }

  .checkbox-container {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    padding: 0.45rem 0.75rem;
    border-radius: var(--border-radius-sm);
    background-color: var(--bg-surface-subtle);
    border: 1px solid var(--border-subtle);
    transition: all var(--transition-fast);
    height: 1.5rem;
  }

  .checkbox-container:hover {
    border-color: var(--border-strong);
    background-color: var(--bg-surface-hover);
  }

  .checkbox-container input[type='checkbox'] {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  .custom-checkbox {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1.5px solid var(--border-strong);
    background-color: var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
  }

  .checkbox-container input[type='checkbox']:checked + .custom-checkbox {
    background-color: var(--arkling-primary);
    border-color: var(--arkling-primary);
    color: #ffffff;
  }

  .checkbox-container input[type='checkbox']:focus-visible + .custom-checkbox {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25);
  }

  .check-icon {
    width: 12px;
    height: 12px;
  }

  .checkbox-title {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--text-main);
  }

  .mini-spinner {
    display: inline-block;
    width: 10px;
    height: 10px;
    border: 2px solid var(--border-subtle);
    border-top-color: #f59e0b;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-left: 0.25rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
    #button_menu_toggle {display: none;}

  @media (max-width: 768px) {
.hide {display: none;}
    #button_menu_toggle {display: flex;}

    .top-bar-inner {
      padding: 0.75rem 1rem;
      flex-direction: column;
      align-items: stretch;
      gap: none;
    }

    .controls-group {
      display: grid;
      grid-template-columns: 1fr;
      width: 100%;
    }

    select {
      width: 100%;
    }
  }
</style>
