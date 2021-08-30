<script>
  import { onMount } from 'svelte'
  const url = 'https://api.mediahack.co.za/vaccine-tracker2-dev/countries.php'
  let countryMenu = false
  let countries = []
  onMount(async () => {
    const res = await fetch(url)
    countries = await res.json()
  })
</script>

<nav id="nav">
  <div class="nav-item dropdown">
    Nav Item <img
      class="select-arrow"
      alt="down-arrow"
      src="images/down-arrow.svg"
    />
    <div class="dropdown-items">
      <div class="dropdown-item" />
    </div>

    <div class="nav-item">Nav Item</div>
    <div class="nav-item">Nav Item</div>
    <div class="nav-item">Nav Item</div>
  </div>
</nav>

<style>
  nav {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    position: relative;
  }
  .nav-item {
    background: #dfe6e8;
    padding: 12px;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
  }
  .select-arrow {
    float: right;
    margin-top: 8px;
  }
  .dropdown {
    display: relative;
  }
  .dropdown-items {
    position: absolute;
    top: 45px;
    left: 0px;
    width: 195px;
    background: #dee6e8;
    padding: 0px;
    height: 0px;
    overflow-y: hidden;
    font-weight: 400;
  }
  .dropdown-selected {
    padding: 0px;
    height: auto;
    overflow-y: auto;
    max-height: 300px;
  }
  .dropdown-item {
    padding: 10px 12px;
  }
  .dropdown-item:hover {
    background: #c3dde4;
  }
</style>
