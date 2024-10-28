<script lang="ts">
  import { base } from '$app/paths';
  import Header, { Mode } from '$lib/ui.components/Header';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';
  import type { MyListEventDetail } from '$lib/ui.components/MovieDetailPanelGrid/types';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { homeService } from '$lib/ui.composition/homeService';
  import type { LoadOutputMyListMovie } from '$lib/ui.services/HomeService.types';
  import { findIndex } from 'lodash-es';
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  let myListMovies: LoadOutputMyListMovie[] = [];
  let loaded = false;
  let mode: Mode = Mode.Normal;

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

    if (myListMovies.length === 0) mode = Mode.Normal;
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
    <MovieDetailPanelGrid movies={myListMovies} on:removeclick={handleRemoveClick} />
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
