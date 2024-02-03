<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import Greeting from './Greeting.svelte'
  import Tables from './Tables.svelte';

  let activeTab = 'filter';

  function setActiveTab(tab) {
    activeTab = tab;
  }
</script>


<main>
  <h1 class="mb-4">iptables on host</h1>

  <div class="mb-8">
    <ul class="flex border-b border-stone-500 justify-center">
      <div class="inline-block py-2 px-4 font-bold">Table:</div>
      <li on:click={() => (activeTab = 'filter')} class="mr-1 {activeTab === 'filter' ? '-mb-px' : ''}">
        <a href="#" class="{activeTab === 'filter' ? 'tabactive' : 'tabinactive'} bg-white inline-block py-2 px-4">
            filter
        </a>
      </li>
      <li on:click={() => (activeTab = 'nat')} class="mr-1 {activeTab === 'nat' ? '-mb-px' : ''}">
        <a href="#" class="{activeTab === 'nat' ? 'tabactive' : 'tabinactive'} bg-white inline-block py-2 px-4">
            nat
        </a>
      </li>
      <li on:click={() => (activeTab = 'mangle')} class="mr-1 {activeTab === 'mangle' ? '-mb-px' : ''}">
        <a href="#" class="{activeTab === 'mangle' ? 'tabactive' : 'tabinactive'} bg-white inline-block py-2 px-4">
            mangle
        </a>
      </li>
    </ul>
  </div>

  <Tables tablename={activeTab}/>

  <!-- <Table iptable={table_filter} /> -->


</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
  .tabactive {
    @apply border-l border-t border-r border-stone-500 rounded-t text-blue-700 font-bold;
  }
  .tabinactive {
    @apply text-blue-500 hover:text-blue-800 font-normal;
  }

</style>
