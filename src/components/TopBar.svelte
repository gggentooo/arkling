<script lang="ts">
  import {tick} from 'svelte';
  import {LANGUAGES, LEARNING_MODES, UI_TRANSLATIONS} from '../lib/constants';
  import {learningState} from '../lib/state/learningState.svelte';
  import {storySelectorState} from '../lib/state/storySelectorState.svelte';
  import type {JapaneseAnnotationMode, LanguageCode, LearningMode} from '../types';

  const t = $derived(
    UI_TRANSLATIONS[learningState.systemLanguage] || UI_TRANSLATIONS['en']
  );

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

  async function preserveReadingPosition(update: () => void | Promise<void>) {
    const lineMarkers = Array.from(document.querySelectorAll<HTMLElement>('.index-num'));
    if (lineMarkers.length === 0) {
      await update();
      await tick();
      return;
    }

    const viewportTop = document.querySelector('.top-bar')?.getBoundingClientRect().bottom ?? 0;
    let markerIndex = lineMarkers.findIndex(
      (marker) => marker.getBoundingClientRect().bottom > viewportTop
    );
    if (markerIndex < 0) markerIndex = lineMarkers.length - 1;

    const originalTop = lineMarkers[markerIndex].getBoundingClientRect().top;
    await update();
    await tick();

    const updatedMarker = document.querySelectorAll<HTMLElement>('.index-num')[markerIndex];
    if (!updatedMarker) return;

    window.scrollBy(0, updatedMarker.getBoundingClientRect().top - originalTop);
  }

  async function handlePinyinToggle(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    await preserveReadingPosition(() => learningState.setDisplayPinyin(checkbox.checked));
  }

  async function handleJapaneseAnnotationChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    await preserveReadingPosition(() =>
      learningState.setJapaneseAnnotationMode(select.value as JapaneseAnnotationMode)
    );
  }

  function sectionOpenClose(button: HTMLButtonElement) {
    const parent = button.parentElement;
    if (!parent) return;
    const isFolded = button.textContent === t.closeMenu;
    button.textContent = isFolded ? t.openMenu : t.closeMenu;

    Array.from(parent.children).forEach((child) => {
      if (child !== button) {
        child.classList.toggle('hide');
      }
    });
  }
</script>

<header class="top-bar">
  <div class="top-bar-inner">
    <div class="arkling">
      <div class="arkling-info">
        <h1 class="arkling-title">ArkLing</h1>
        <a href="https://github.com/gggentooo/arkling" class="arkling-subtitle">Source (GitHub)</a>
      </div>
    </div>

    <div class="controls-group">
      <button class="hide" id="button_menu_toggle" onclick={(e) => sectionOpenClose(e.currentTarget)}>
        {t.closeMenu}
      </button>

      <div class="control-item">
        <label for="target-language-select" class="control-label">
          {t.targetLanguage}
        </label>
        <div class="select-wrapper">
          <select
              id="target-language-select"
              value={learningState.targetLanguage}
              onchange={handleTargetLanguageChange}
              aria-label={t.targetLanguage}
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

      <div class="control-item">
        <label for="system-language-select" class="control-label">
          {t.systemLanguage}
        </label>
        <div class="select-wrapper">
          <select
              id="system-language-select"
              value={learningState.systemLanguage}
              onchange={handleSystemLanguageChange}
              aria-label={t.systemLanguage}
          >
            {#each LANGUAGES as lang}
              <option
                  value={lang.code}
                  disabled={lang.code === learningState.targetLanguage}
                  class:disabled-option={lang.code === learningState.targetLanguage}
              >
                {lang.label} ({lang.nativeLabel})
                {lang.code === learningState.targetLanguage ? t.targetSuffix : ''}
              </option>
            {/each}
          </select>
          <span class="dropdown-chevron" aria-hidden="true">▾</span>
        </div>
      </div>

      <div class="control-item">
        <label for="learning-mode-select" class="control-label">
          {t.learningMode}
        </label>
        <div class="select-wrapper">
          <select
              id="learning-mode-select"
              value={learningState.learningMode}
              onchange={handleLearningModeChange}
              aria-label={t.learningMode}
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

      {#if learningState.targetLanguage === 'zh'}
        <div class="control-item checkbox-control-item">
     <span class="control-label">
      {t.pinyin}
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
            <span class="checkbox-title">{t.displayPinyin}</span>
          </label>
        </div>
      {:else if learningState.targetLanguage === 'ja'}
        <div class="control-item">
          <label for="japanese-annotations-select" class="control-label">
            {t.annotations}
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
                aria-label={t.annotations}
            >
              <option value="none">{t.noAnnotations}</option>
              <option value="furigana">{t.furigana}</option>
              <option value="romaji">{t.romaji}</option>
            </select>
            <span class="dropdown-chevron" aria-hidden="true">▾</span>
          </div>
        </div>
      {/if}
    </div>
  </div>
</header>
