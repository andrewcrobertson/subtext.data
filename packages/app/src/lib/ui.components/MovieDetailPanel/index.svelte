<script lang="ts">
  import { base } from '$app/paths';
  import MinusCircleIcon from '$lib/ui.icons/MinusCircleIcon.svelte';
  import PlusCircleIcon from '$lib/ui.icons/PlusCircleIcon.svelte';
  import { formatRunTime, formatTextArray, formatRated, formatReleaseYear } from '$lib/ui.utils/format';
  import { createEventDispatcher } from 'svelte';
  import type * as T from './types';
  export let movie: T.Movie;

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

<div class="flex items-start overflow-hidden">
  <a href={`${base}/subtitles/${movie.imdbId}`} class="w-1/2">
    <img src={movie.posterUrl} alt={movie.title} class="w-full h-auto" />
  </a>
  <div class="pl-1 w-1/2 flex flex-col justify-between h-full text-sm text-gray-300">
    <div>
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
      <p class="hidden sm:block"><span class="text-sm text-gray-500">Cast:</span> {formatTextArray(movie.actors, 'Unknown')}</p>
      <p class="hidden sm:block">
        <span class="text-sm text-gray-500">{movie.directors.length === 1 ? 'Director' : 'Directors'}:</span>
        {formatTextArray(movie.directors, 'Unknown')}
      </p>
    </div>
    {#if movie.isOnMyList}
      <button
        class="flex items-center justify-center w-full h-10 space-x-1 bg-yellow-500 text-white font-bold hover:bg-yellow-600"
        on:click={() => onRemoveFromListClick(movie.imdbId)}
      >
        <span>Remove</span>
        <MinusCircleIcon class="text-lg text-white size-6" />
      </button>
    {:else}
      <button
        class="flex items-center justify-center w-full h-10 space-x-1 bg-gray-800 text-white font-bold hover:bg-gray-900"
        on:click={() => onAddToListClick(movie.imdbId)}
      >
        <span>Add</span>
        <PlusCircleIcon class="text-lg text-white size-6" />
      </button>
    {/if}
  </div>
</div>
