<script lang="ts">
  let _class = '';
  import { base } from '$app/paths';
  import ChatBubbleLeftRightIcon from '$lib/ui.icons/ChatBubbleLeftRightIcon.svelte';
  import MagnifyingGlassIcon from '$lib/ui.icons/MagnifyingGlassIcon.svelte';
  import PencilSquareIcon from '$lib/ui.icons/PencilSquareIcon.svelte';
  import PlusIcon from '$lib/ui.icons/PlusIcon.svelte';
  import QuestionMarkCircleIcon from '$lib/ui.icons/QuestionMarkCircleIcon.svelte';
  import { createEventDispatcher } from 'svelte';
  import { twMerge } from 'tailwind-merge';
  import * as T from './types';
  export { _class as class };

  export let mode: T.Mode = T.Mode.Normal;
  const dispatch = createEventDispatcher();

  const onEditClick = ({}: MouseEvent) => {
    if (mode === T.Mode.Edit) {
      mode = T.Mode.Normal;
    } else {
      mode = T.Mode.Edit;
    }

    dispatch('modechange', { mode });
  };
</script>

<div class={twMerge('flex justify-between items-center p-4 z-10 bg-black bg-opacity-80 border-b-2 border-yellow-500', _class)}>
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
