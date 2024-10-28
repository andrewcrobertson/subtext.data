<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { requestService } from '$lib/ui.composition/requestService';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let query = '';

  const idOrUrl = writable('');

  const handleBackClick = ({}: MouseEvent) => history.back();

  const handleSubmit = async ({}: SubmitEvent) => {
    const submitRequestRes = await requestService.submitRequest($idOrUrl);
    const link = base + (submitRequestRes.success ? '/request/ok' : '/request/err');
    goto(link, { replaceState: true });
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('q') ?? '';
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between text-white p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <div class="flex space-x-2">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="size-8" />
    </button>
  </div>
</div>
<div class="mt-16"></div>
<div class="p-4 text-xl mx-auto max-w-screen-md">
  <div class="pb-10 text-white">
    <p class="pb-4">
      To request subtitles for a movie, <a class="font-bold text-yellow-500" href={requestService.getImdbQueryUrl(query)}>search for the movie in IMDb</a> and submit
      it's url or id below.
    </p>
    <p>
      To find out more, you can read about IMDb <a class="font-bold text-yellow-500" href="https://developer.imdb.com/documentation/key-concepts"
        >data key concepts</a
      >.
    </p>
  </div>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="text" class="h-8 p-2" bind:value={$idOrUrl} />
    <button class="text-white" type="submit">Submit</button>
  </form>
</div>
