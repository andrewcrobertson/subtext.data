<script lang="ts">
  import { base } from '$app/paths';
  import Header, { Mode as HMode } from '$lib/ui.components/Header';
  import MovieDetailPanel, { type MyListEventDetail, type Movie, Mode as PMode } from '$lib/ui.components/MovieDetailPanel';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { homeService } from '$lib/ui.composition/homeService';
  import { findIndex } from 'lodash-es';
  import { onMount, tick } from 'svelte';

  let myListMovies: Movie[] = [];
  let loaded = false;
  let mode: HMode = HMode.Online;

  const handleRemoveClick = async ({ detail }: CustomEvent<MyListEventDetail>) => {
    const imdbId = detail.id;
    await homeService.removeFromMyList(imdbId);
    const idx = findIndex(myListMovies, (m) => m.imdbId === imdbId);
    myListMovies.splice(idx, 1);
    try {
      document.startViewTransition(async () => {
        myListMovies = myListMovies;
        await tick();
      });
    } catch {
      myListMovies = myListMovies;
    }
  };

  onMount(async () => {
    const loadRes = await homeService.load();
    myListMovies = loadRes.myListMovies;
    loaded = true;
  });
</script>

<Header class="fixed top-0 left-0 right-0" {mode} />
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if myListMovies.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 overflow-y-auto scrollbar-hide">
      {#each myListMovies as movie}
        <MovieDetailPanel mode={PMode.Play} {movie} on:removeclick={handleRemoveClick} />
      {/each}
    </div>
  {:else}
    <div class="px-1 mx-auto max-w-screen-md">
      <p class="text-white text-xl mt-4">
        You currently don't have any movies in your list. Would you like to <a class="font-bold text-yellow-500 underline" href={`${base}/search`}
          >search for a movie</a
        >?
      </p>
    </div>
  {/if}
</TransitionWhenLoaded>
