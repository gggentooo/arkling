<script lang="ts">
  import {learningState} from "../lib/state/learningState.svelte";
  import LineItem from "./LineItem.svelte";
</script>

<div class="focused-container">
  <div class="focused-lines-list">
    {#each learningState.lines as line, index (line.id)}
      {@const isRevealed = learningState.isLineRevealed(line.id)}
      <div class="focused-line-card" class:revealed={isRevealed}>
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

          </div>
        </div>

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
