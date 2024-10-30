<script lang="ts">
  import ExclamationTriangleIcon from '$lib/ui.icons/ExclamationTriangleIcon.svelte';
</script>

<div class="flex items-start p-4 w-full max-w-md mx-auto">
  <ExclamationTriangleIcon class="h-10 w-10 mr-3 mt-1 shrink-0 text-yellow-500" />
  <slot />
</div>
