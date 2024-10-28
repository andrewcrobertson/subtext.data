<script lang="ts">
  import { base } from '$app/paths';
  import MovieDetailPanelGrid from '$lib/ui.components/MovieDetailPanelGrid';
  import type { Movie, MyListEventDetail } from '$lib/ui.components/MovieDetailPanelGrid/types';
  import TransitionWhenLoaded from '$lib/ui.components/TransitionWhenLoaded';
  import { searchService } from '$lib/ui.composition/searchService';
  import { myListManager } from '$lib/ui.composition/myListManager';
  import ArrowLeftIcon from '$lib/ui.icons/ArrowLeftIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import { onMount } from 'svelte';

  let recentMovies: Movie[] = [];
  let currentMovies: Movie[] = [];
  let loaded = false;
  let searchQuery = '';
  // $: filteredMovies = await getFilteredMovies(searchQuery);

  const getFilteredMovies = async (searchQuery: string) => await searchService.search(searchQuery);

  const updateIsOnMyList = (imdbId: string, isOnMyList: boolean) => {
    if (isOnMyList) {
      myListManager.add(imdbId);
    } else {
      myListManager.remove(imdbId);
    }

    // const idx1 = findIndex(currentMovies, (m) => m.imdbId === imdbId);
    // if (idx1 !== -1) currentMovies[idx1].isOnMyList = isOnMyList;
    // const idx2 = findIndex(filteredMovies, (m) => m.imdbId === imdbId);
    // if (idx2 !== -1) filteredMovies[idx2].isOnMyList = isOnMyList;
    // const idx3 = findIndex(recentMovies, (m) => m.imdbId === imdbId);
    // if (idx3 !== -1) recentMovies[idx3].isOnMyList = isOnMyList;
  };

  const handleBackClick = ({}: MouseEvent) => history.back();
  const handleAddClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, true);
  const handleRemoveClick = ({ detail }: CustomEvent<MyListEventDetail>) => updateIsOnMyList(detail.id, false);

  onMount(async () => {
    const loadRes = await searchService.load();
    currentMovies = loadRes.currentMovies;
    recentMovies = loadRes.recentMovies;
    loaded = true;
  });
</script>

<div class="fixed top-0 left-0 right-0 flex items-center justify-between p-2 z-10 bg-black bg-opacity-70 border-b-2 border-yellow-500">
  <button class="btn btn-square text-white" on:click={handleBackClick}>
    <ArrowLeftIcon class="size-8" />
  </button>
  <div class="flex items-center">
    <MagnifyingGlassIcon class="text-white size-8 mr-1" />
    <input type="text" class="h-8 p-2" bind:value={searchQuery} />
  </div>
</div>
<div class="mt-16"></div>
<TransitionWhenLoaded {loaded}>
  {#if searchQuery.length === 0}
    {#if currentMovies.length > 0}
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">Current</h2>
      <MovieDetailPanelGrid movies={currentMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    {/if}
    {#if recentMovies.length > 0}
      <h2 class="text-white text-xl md:text-2xl lg:text-3xl font-semibold">Suggested</h2>
      <MovieDetailPanelGrid movies={recentMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    {/if}
    {#if currentMovies.length + recentMovies.length === 0}
      <p class="text-white text-xl mt-4">
        There are no movies in the database. Would you like to <a class="font-bold text-yellow-500" href={`${base}/request?q=${searchQuery}`}>request</a> one?
      </p>
    {/if}
    <!-- {:else if filteredMovies.length > 0}
    <MovieDetailPanelGrid movies={filteredMovies} on:addclick={handleAddClick} on:removeclick={handleRemoveClick} />
    <p class="text-white text-xl mt-4">
      Not what you were looking for? Would you like to <a class="font-bold text-yellow-500" href={`${base}/request?q=${searchQuery}`}>request</a> it?
    </p> -->
  {:else}
    <p class="text-white text-xl mt-4">
      Sorry, we couldn't find a matching movie in the database. Would you like to <a class="font-bold text-yellow-500" href={`${base}/request?q=${searchQuery}`}
        >request</a
      > it?
    </p>
  {/if}
</TransitionWhenLoaded>
