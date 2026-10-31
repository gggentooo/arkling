<script lang="ts">
  import {learningState} from '../lib/state/learningState.svelte';
  import LineItem from './LineItem.svelte';

</script>

<div class="side-by-side-container">
  <div class="lines-grid">
    {#each learningState.lines as line, index (line.id)}
      <div class="line-row">
        <div class="index-num-container"><span class="index-num">{index + 1}</span></div>
        <div class="pane pane-target">
          <LineItem
              {line}
              language={learningState.targetLanguage}
              variant="target"
          />
        </div>

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
