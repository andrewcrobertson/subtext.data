<script lang="ts">
  import { base } from '$app/paths';
  import XMarkIcon from '$lib/ui.icons/XMarkIcon.svelte';
  import PlayIcon from '$lib/ui.icons/PlayIcon.svelte';
  import PlusIcon from '$lib/ui.icons/PlusIcon.svelte';
  import { formatRunTime, formatTextArray, formatRated, formatReleaseYear } from '$lib/ui.utils/format';
  import { createEventDispatcher } from 'svelte';
  import * as T from './types';
  export let movie: T.Movie;
  export let mode: T.Mode;

  const dispatch = createEventDispatcher();

  const onAddToListClick = (id: string) => {
    const eventDetail: T.MyListEventDetail = { id };
    dispatch('addclick', eventDetail);
  };

  const onRemoveFromListClick = (id: string) => {
    const eventDetail: T.MyListEventDetail = { id };
    dispatch('removeclick', eventDetail);
  };
</script>

<div class="flex w-full h-full bg-gray-800">
  <div class="w-1/2">
    {#if mode === T.Mode.Play}
      <a href={`${base}/subtitles/${movie.imdbId}`} class="w-1/2">
        <img src={movie.posterUrl} alt={movie.title} class="w-full h-full object-cover" />
      </a>
    {:else}
      <img src={movie.posterUrl} alt={movie.title} class="w-full h-full object-cover" />
    {/if}
  </div>
  <div class="w-1/2 relative text-sm text-gray-300">
    <div class="absolute top-0 left-0 right-0 p-2">
      <h3 class="text-lg font-semibold text-white">{movie.title}</h3>
      <div class="flex items-center justify-between pb-2">
        <div class="flex space-x-2">
          <p>{formatReleaseYear(movie.releaseDate, null, 'Unknown')}</p>
          <p>{formatRunTime(movie.runTime, 'Unknown')}</p>
        </div>
        <p class="text-xs border border-gray-400 bg-gray-800 px-3">{formatRated(movie.rated, '?')}</p>
      </div>
      <p class="hidden sm:block">
        <span class="text-sm text-gray-500">{movie.genres.length === 1 ? 'Genre' : 'Genres'}:</span>
        {formatTextArray(movie.genres, 'Unknown')}
      </p>
      <p class=""><span class="text-sm text-gray-500 hidden sm:block">Cast:&nbsp;</span>{formatTextArray(movie.actors, 'Unknown')}</p>
      <p class="hidden sm:block">
        <span class="text-sm text-gray-500">{movie.directors.length === 1 ? 'Director' : 'Directors'}:</span>
        {formatTextArray(movie.directors, 'Unknown')}
      </p>
      <!-- <p class="hidden sm:block pt-4 mt-4 border-t border-gray-500">
        {movie.plot}
      </p> -->
    </div>
    <div class="absolute bottom-0 left-0 right-0 p-2">
      {#if mode === T.Mode.Play}
        <a
          class="flex items-center justify-center w-full h-10 space-x-1 bg-black text-white font-bold hover:bg-gray-900"
          href={`${base}/subtitles/${movie.imdbId}`}
        >
          <span>Play</span>
          <PlayIcon class="text-lg text-white size-6" />
        </a>
      {/if}
      {#if movie.isOnMyList}
        <button
          class="flex items-center justify-center w-full h-10 space-x-1 bg-yellow-500 text-white font-bold hover:bg-yellow-600"
          on:click={() => onRemoveFromListClick(movie.imdbId)}
        >
          <span>Remove</span>
          <XMarkIcon class="text-lg text-white size-6" />
        </button>
      {:else}
        <button
          class="flex items-center justify-center w-full h-10 space-x-1 bg-black text-white font-bold hover:bg-gray-900"
          on:click={() => onAddToListClick(movie.imdbId)}
        >
          <span>Add</span>
          <PlusIcon class="text-lg text-white size-6" />
        </button>
      {/if}
    </div>
  </div>
</div>
