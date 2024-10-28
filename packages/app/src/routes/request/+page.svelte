<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { requestService } from '$lib/ui.composition/requestService';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  let query = '';
  const idOrUrl = writable('');

  const handleBackClick = () => history.back();

  const handleSubmit = async () => {
    const submitRequestRes = await requestService.submitRequest($idOrUrl);
    const link = base + (submitRequestRes.success ? '/request/ok' : '/request/err');
    goto(link, { replaceState: true });
  };

  onMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    query = urlParams.get('q') ?? '';
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-black bg-opacity-80 border-b-2 border-yellow-500 h-14">
  <div class="flex items-center space-x-4">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="w-5 h-5" />
    </button>
    <p class="text-white font-semibold text-lg">Request Subtitles</p>
  </div>
</div>
<div class="mt-16"></div>
<div class="p-4 mx-auto max-w-screen-md text-white">
  <div class="pb-10">
    <p class="text-lg mb-4">
      To request subtitles, <a class="font-bold text-yellow-500 underline" href={requestService.getImdbQueryUrl(query)}>search for the movie on IMDb</a> and
      submit the movie’s IMDb URL or ID below. For more information, read about
      <a class="font-bold text-yellow-500 underline" href="https://developer.imdb.com/documentation/key-concepts" target="_blank">IMDb data concepts</a>.
    </p>
  </div>
  <form on:submit|preventDefault={handleSubmit} class="flex items-center gap-2">
    <input
      type="text"
      class="w-full h-10 p-2 bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-500"
      placeholder="Enter IMDb movie URL or ID"
      bind:value={$idOrUrl}
    />
    <button type="submit" class="h-10 px-4 bg-yellow-500 text-black font-bold hover:bg-yellow-600">Submit</button>
  </form>
</div>
