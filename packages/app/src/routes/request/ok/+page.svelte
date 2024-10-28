<script lang="ts">
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';

  const handleBackClick = ({}: MouseEvent) => history.back();
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-black bg-opacity-80 border-b-2 border-yellow-500 h-14">
  <div class="flex items-center space-x-4">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="w-5 h-5" />
    </button>
    <p class="text-white font-semibold text-lg">Request a Movie</p>
  </div>
</div>
<div class="mt-16"></div>
<div class="p-4 text-xl mx-auto max-w-screen-md">
  <div class="pb-10 text-white">
    <p class="pb-4">Your request was successful. We're trying to load up the movie you requested. Check back soon.</p>
  </div>
</div>
