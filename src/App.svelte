<script lang="ts">
  import TopBar from './components/TopBar.svelte';
  import MainArea from './components/MainArea.svelte';
</script>

<div class="app-layout">
  <TopBar />
  <MainArea />
</div>

<style>
  .app-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-app);
  }
</style>
