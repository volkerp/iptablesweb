<script>
import { onMount } from 'svelte';

import Chain from './Chain.svelte'

export let tablename = "filter";

// const table_mang = iptables.tables[2]

const url = import.meta.env.PROD ? '/iptables' : "http://localhost:3030/iptables";

let iptables = null;
let tables = [];
let table = null;
let chains = []
let myerror = null;

let activeTab = 'filter';
let cur_table = {name: "", chains: []}

async function getIptables() {
        const response = await fetch(url);
        if (response.status !== 200) throw new Error((await response.json()).message);

        iptables = await response.json();
        console.log(iptables);
        tables = iptables.tables;
        cur_table = tables[0]
        if (tablename === "filter") {
            table = iptables.tables[0];
        } else if (tablename === "nat") {
            table = iptables.tables[1];
        } else if (tablename === "mangle") {    
        } else {
            throw new Error("tablename not found");
        }
        myerror = null;

    
    chains = table?.chains || []
}

onMount(async () => await getIptables())

$: tablename, getIptables()


</script>

<div class="mb-8">
    <ul class="flex border-b border-stone-500 justify-center">
      <div class="inline-block py-2 px-4 font-bold">Table:</div>
      {#each tables as table}
        <li on:click={() => (cur_table = table)} class="mr-1 {cur_table.name === table.name ? '-mb-px' : ''}">
          <a href="#" class="{cur_table.name === table.name ? 'tabactive' : 'tabinactive'} bg-white inline-block py-2 px-4">
              {table.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>

{#key cur_table.chains}
    {#each cur_table.chains as chain (chain.name)}
        <Chain chain={chain} />
        <div class="min-h-9"></div>
    {/each}
{/key} 

<style>
  .tabactive {
    @apply border-l border-t border-r border-stone-500 rounded-t text-blue-700 font-bold;
  }
  .tabinactive {
    @apply text-blue-500 hover:text-blue-800 font-normal;
  }
</style>