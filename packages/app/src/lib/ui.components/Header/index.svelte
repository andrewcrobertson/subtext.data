<script lang="ts">
  let _class = '';
  import { base } from '$app/paths';
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import PencilSquareIcon from '$lib/ui.icons/PencilSquareIcon.svelte';
  import PlusIcon from '$lib/ui.icons/PlusIcon.svelte';
  import XMarkIcon from '$lib/ui.icons/XMarkIcon.svelte';
  import QuestionMarkCircleIcon from '$lib/ui.icons/QuestionMarkCircleIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  import { twMerge } from 'tailwind-merge';
  import * as T from './types';
  export { _class as class };

  export let mode: T.Mode = T.Mode.Normal;
  const dispatch = createEventDispatcher();

  const onEditClick = () => {
    mode = mode === T.Mode.Edit ? T.Mode.Normal : T.Mode.Edit;
    dispatch('modechange', { mode });
  };
</script>

{#if mode === T.Mode.Edit}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div transition:fade class={twMerge('flex justify-between items-center p-4 z-10 bg-yellow-500 border-b-2 border-yellow-500', _class)} on:click={onEditClick}>
    <div class="flex space-x-4">
      <div class="flex items-center">
        <ChatBubbleLeftRightIcon class="text-black w-6 h-6 mr-2" />
        <p class="font-semibold text-lg text-black hidden sm:block">SubText</p>
      </div>
      <p class="font-semibold text-xl text-white">Edit</p>
    </div>
    <div class="flex space-x-4">
      <button class="flex items-center">
        <XMarkIcon class="font-semibold text-lg text-white size-6" />
      </button>
    </div>
  </div>
{:else}
  <div transition:fade class={twMerge('flex justify-between items-center p-4 z-10 bg-black bg-opacity-80 border-b-2 border-yellow-500', _class)}>
    <div class="flex space-x-4">
      <div class="flex items-center">
        <ChatBubbleLeftRightIcon class="text-yellow-500 w-6 h-6 mr-2" />
        <p class="font-semibold text-lg text-yellow-500 hidden sm:block">SubText</p>
      </div>
      <a href={`${base}/help`} class="flex items-center">
        <QuestionMarkCircleIcon class="text-white w-5 h-5" />
        <p class="text-white text-sm hidden sm:inline">Help</p>
      </a>
    </div>
    <div class="flex space-x-4">
      <button class="flex items-center" on:click={onEditClick}>
        <PencilSquareIcon class="text-white w-5 h-5" />
        <p class="text-white text-sm hidden sm:inline">Edit</p>
      </button>
      <a href={`${base}/request`} class="flex items-center">
        <PlusIcon class="text-white w-5 h-5" />
        <p class="text-white text-sm hidden sm:inline">Request</p>
      </a>
      <a href={`${base}/search`} class="flex items-center">
        <MagnifyingGlassIcon class="text-white w-5 h-5" />
        <p class="text-white text-sm hidden sm:inline">Search</p>
      </a>
    </div>
  </div>
{/if}
