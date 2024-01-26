<script>
import { onMount } from 'svelte';

import Table from './Table.svelte'

// const table_mang = iptables.tables[2]

const url = import.meta.env.PROD ? 'hello' : "http://localhost:3030/iptables";

let iptables = [];
let table_filter = null;

async function getIptables() {
    const opts = {
        method: "get"
    };
    const response = await fetch(url, opts);
    iptables = await response.json();
    table_filter = iptables.tables[0];

    console.log("iptables", table_filter);
}

//onMount(async () => await getIptables())

</script>

{#await getIptables()}
    <p>loading...</p>
{:then}
{#each table_filter.chains as chain}
    <Table chain={chain} />
    <div class="min-h-8"></div>
{/each}
{:catch error}
    <p style="color: red">{error.message}</p>
{/await}

