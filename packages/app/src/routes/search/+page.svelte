<script lang="ts">
  import { base } from '$app/paths';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';
  import type { Movie, MyListEventDetail } from '$lib/ui.components/MovieDetailPanelGrid/types';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { searchService } from '$lib/ui.composition/searchService';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import PlusIcon from '$lib/ui.icons/PlusIcon.svelte';
  import ShieldExclamationIcon from '$lib/ui.icons/ShieldExclamationIcon.svelte';
  import { findIndex } from 'lodash-es';
  import { onMount } from 'svelte';

  let searchQuery = '';
  let recentMovies: Movie[] = [];
  let filteredMovies: Movie[] = [];
  let loaded = false;

  const updateIsOnMyList = async (imdbId: string, isOnMyList: boolean) => {
    await searchService.updateIsOnMyList(imdbId, isOnMyList);
    const idx1 = findIndex(recentMovies, (m) => m.imdbId === imdbId);
    const idx2 = findIndex(filteredMovies, (m) => m.imdbId === imdbId);
    if (idx1 !== -1) recentMovies[idx1].isOnMyList = isOnMyList;
    if (idx2 !== -1) filteredMovies[idx2].isOnMyList = isOnMyList;
  };

  $: handleQueryChange(searchQuery);
  const handleQueryChange = async (searchQuery: string) => (filteredMovies = await searchService.search(searchQuery));
  const handleBackClick = ({}: MouseEvent) => history.back();
  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, true);
  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, false);

  onMount(async () => {
    const loadRes = await searchService.load();
    recentMovies = loadRes.recentMovies;
    loaded = true;
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-4 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500 h-14">
  <div class="flex space-x-4 items-center">
    <button class="btn btn-square text-white" on:click={handleBackClick}>
      <ArrowLeftIcon class="size-5" />
    </button>
    <p class="text-white font-semibold text-lg">Search</p>
  </div>
  <div class="flex space-x-2 items-center w-1/2 sm:w-1/3 md:w-1/4">
    <input
      type="text"
      class="w-full h-6 p-1 bg-gray-800 text-white text-sm border border-gray-700 focus:outline-none focus:border-yellow-500"
      placeholder="Find a movie"
      bind:value={searchQuery}
    />
    <MagnifyingGlassIcon class="text-white size-5" />
  </div>
</div>

<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if searchQuery.length === 0}
    {#if recentMovies.length > 0}
      <MovieDetailPanelGrid movies={recentMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    {/if}
    {#if recentMovies.length === 0}
      <div class=" px-1 mx-auto max-w-screen-md">
        <p class="text-white text-xl mt-4">
          There are currently no movies in the database. Would you like to
          <a class="font-bold text-yellow-500 underline" href={`${base}/request?q=${searchQuery}`}>request a movie?</a>
        </p>
      </div>
    {/if}
  {:else if filteredMovies.length > 0}
    <MovieDetailPanelGrid movies={filteredMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    <div class=" px-1 mx-auto max-w-screen-md">
      <p class="text-white text-xl mt-4">
        Couldn't find the movie you wanted? Would you like to <a class="font-bold text-yellow-500 underline" href={`${base}/request?q=${searchQuery}`}
          >request it</a
        >?
      </p>
    </div>
  {:else}
    <div class=" px-1 mx-auto max-w-screen-md">
      <p class="text-white text-xl mt-4">
        Sorry, we couldn't find the movie you wanted. Would you like to <a class="font-bold text-yellow-500 underline" href={`${base}/request?q=${searchQuery}`}
          >request it</a
        >?
      </p>
    </div>
  {/if}
</TransitionWhenLoaded>
