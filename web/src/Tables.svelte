<script>
import { onMount } from 'svelte';

import Table from './Table.svelte'

export let tablename = "filter";

// const table_mang = iptables.tables[2]

const url = import.meta.env.PROD ? 'hello' : "http://localhost:3030/iptables";

let iptables = [];
let table = null;
let chains = []
let myerror = null;

async function getIptables() {
        const response = await fetch(url);
        if (response.status !== 200) throw new Error((await response.json()).message);

        iptables = await response.json();
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
    console.log("iptables", table);
}

// onMount(async () => await getIptables())

$: tablename, getIptables()


</script>

{#key chains}
    {#each chains as chain (chain.name)}
        <Table chain={chain} />
        <div class="min-h-8"></div>
    {/each}
{/key} 

<!-- {#await getIptables()}

    <p>loading...</p>

{:then}

    {#each table.chains as chain}
        <Table chain={chain} />
        <div class="min-h-8"></div>
    {/each}
    
{:catch error}
<div class="border-4 border-red-400 bg-red-200 p-5">
    <p class="font-semibold text-lg">{error.message}</p>
</div>
{/await} -->