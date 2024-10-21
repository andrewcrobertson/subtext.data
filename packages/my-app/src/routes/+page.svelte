<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;
</script>

<div>
  {JSON.stringify(data)}
  <!-- {#each data as item}
     <h2>{item.title}</h2>
     <p>{item.content}</p>
  {/each} -->
</div>
