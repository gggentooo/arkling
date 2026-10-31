<script lang="ts">
  import { learningState } from '../lib/state/learningState.svelte';
  import { storySelectorState } from '../lib/state/storySelectorState.svelte';
  import StorySelector from './StorySelector.svelte';
  import SideBySideView from './SideBySideView.svelte';
  import FocusedView from './FocusedView.svelte';

  function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<main class="main-area">
  <div class="main-container">
  <StorySelector />

  <section class="script-content">
    {#if learningState.lines.length === 0 && storySelectorState.isLoadingScript}
    <div class="empty-state">
      <span class="empty-spinner"></span>
      <p>Retrieving scripts...</p>
    </div>
    {:else if learningState.learningMode === 'side-by-side'}
    <SideBySideView />
    {:else}
    <FocusedView />
    {/if}
  </section>
  <StorySelector />

  <button type="button" class="scroll-to-top" onclick={scrollToTop} aria-label="Jump to top">
    ▲
  </button>

  <p class="footer">© gggentooo 2026; https://github.com/gggentooo/arkling</p>
  </div>
</main>
