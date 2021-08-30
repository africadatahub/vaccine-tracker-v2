<script>
  // import logo from './assets/svelte.png'
  // import Counter from './lib/Counter.svelte'
  import NavBar from './components/NavBar.svelte'
  import SmallCharts from './components/SmallCharts.svelte'
  import MainDisplay from './components/MainDisplay.svelte'
</script>

<main>
  <div id="container">
    <header>
      <h1>ADH Vaccine Tracker</h1>
    </header>
    <NavBar />
    <SmallCharts />
    <MainDisplay />
  </div>
</main>

<style>
</style>
