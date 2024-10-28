<script lang="ts">
  import { base } from '$app/paths';
  import Header from '$lib/ui.components/Header';
  import PosterLink from '$lib/ui.components/PosterLink';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { homeService } from '$lib/ui.composition/homeService';
  import ChevronRightIcon from '$lib/ui.icons/ChevronRightIcon.svelte';
  import type { LoadOutputMyListMovie } from '$lib/ui.services/HomeService.types';
  import { onMount } from 'svelte';

  let myListMovies: LoadOutputMyListMovie[] = [];
  let loaded = false;

  onMount(async () => {
    const loadRes = await homeService.load();
    myListMovies = loadRes.myListMovies;
    loaded = true;
  });
</script>

<Header class="fixed top-0 left-0 right-0" />
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if myListMovies.length > 0}
    <div class="flex justify-between items-center py-4 px-2">
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">My List</h2>
      <a href={`${base}/search`} class="flex items-center text-white text-xl md:text-2xl lg:text-3xl font-semibold">
        Edit
        <ChevronRightIcon class="font-semibold" />
      </a>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each myListMovies as { imdbId, title, posterUrl }}
        <PosterLink href={`${base}/subtitles/${imdbId}`} src={posterUrl} alt={title} />
      {/each}
    </div>
  {/if}
</TransitionWhenLoaded>
