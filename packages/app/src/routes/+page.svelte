<script lang="ts">
  import { base } from '$app/paths';
  import Header, { Mode } from '$lib/ui.components/Header';
  import type { ModeChangeEventDetail } from '$lib/ui.components/Header/types';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { homeService } from '$lib/ui.composition/homeService';
  import MinusCircleIcon from '$lib/ui.icons/MinusCircleIcon.svelte';
  import type { LoadOutputMyListMovie } from '$lib/ui.services/HomeService.types';
  import { findIndex } from 'lodash-es';
  import { onMount, tick } from 'svelte';
  import { fade } from 'svelte/transition';

  let myListMovies: LoadOutputMyListMovie[] = [];
  let loaded = false;
  let mode: Mode = Mode.Normal;

  const handleModeChange = ({ detail }: CustomEvent<ModeChangeEventDetail>) => (mode = detail.mode);

  const onRemoveFromListClick = async (imdbId: string) => {
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

<Header class="fixed top-0 left-0 right-0" {mode} allowEdit={myListMovies.length > 0} on:modechange={handleModeChange} />
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if myListMovies.length > 0}
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-1 px-1 pb-1 overflow-y-auto scrollbar-hide">
      {#each myListMovies as { imdbId, title, posterUrl }}
        <div class="relative group">
          <a href={`${base}/subtitles/${imdbId}`} class="block">
            <img src={posterUrl} alt={title} class="w-full" />
          </a>
          {#if mode === Mode.Edit}
            <div transition:fade={{ duration: 500 }} class="absolute inset-x-0 bottom-0">
              <button
                class="flex items-center justify-center w-full h-10 space-x-1 bg-yellow-500 text-white font-bold hover:bg-yellow-600"
                on:click={() => onRemoveFromListClick(imdbId)}
              >
                <span>My List</span>
                <MinusCircleIcon class="text-lg text-white size-6" />
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <div class=" px-1 mx-auto max-w-screen-md">
      <p class="text-white text-xl mt-4">
        You currently don't have any movies in your list. Would you like to <a class="font-bold text-yellow-500 underline" href={`${base}/search`}
          >search for a movie</a
        >?
      </p>
    </div>
  {/if}
</TransitionWhenLoaded>
