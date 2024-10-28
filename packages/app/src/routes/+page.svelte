<script lang="ts">
  import { base } from '$app/paths';
  import Header, { Mode } from '$lib/ui.components/Header';
  import type { ModeChangeEventDetail } from '$lib/ui.components/Header/types';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { homeService } from '$lib/ui.composition/homeService';
  import MinusCircleIcon from '$lib/ui.icons/MinusCircleIcon.svelte';
  import type { LoadOutputMyListMovie } from '$lib/ui.services/HomeService.types';
  import { onMount } from 'svelte';

  let myListMovies: LoadOutputMyListMovie[] = [];
  let loaded = false;
  let mode: Mode = Mode.Normal;

  const handleModeChange = ({ detail }: CustomEvent<ModeChangeEventDetail>) => (mode = detail.mode);

  const onRemoveFromListClick = (imdbId: string) => {
    //myListMovies = myListMovies.filter(movie => movie.imdbId !== imdbId);
    console.log(imdbId);
  };

  onMount(async () => {
    const loadRes = await homeService.load();
    myListMovies = loadRes.myListMovies;
    loaded = true;
  });
</script>

<Header class="fixed top-0 left-0 right-0" {mode} on:modechange={handleModeChange} />
<div class="mt-16"></div>

<TransitionWhenLoaded {loaded}>
  {#if myListMovies.length > 0}
    <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 pr-2 overflow-y-auto scrollbar-hide">
      {#each myListMovies as { imdbId, title, posterUrl }}
        <div class="relative group">
          <a href={`${base}/subtitles/${imdbId}`} class="block">
            <img src={posterUrl} alt={title} class="w-full" />
          </a>
          {#if mode === Mode.Edit}
            <div class="absolute bottom-0 left-0 right-0 bg-red-500 bg-opacity-70 text-white text-center p-2">
              <button class="btn text-white w-full flex items-center" on:click={() => onRemoveFromListClick(imdbId)}>
                <span>Remove&nbsp;</span>
                <MinusCircleIcon class="text-lg text-white size-8" />
              </button>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</TransitionWhenLoaded>
