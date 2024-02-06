<script>
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'

  import Tables from './Tables.svelte';


</script>


<main>
  <h1 class="mb-4">iptables on host</h1>
  <Tables/>
  <div class="text-left text-sm"><a href="https://github.com/volkerp/iptablesweb" >https://github.com/volkerp/iptablesweb</a></div>
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

</style>
