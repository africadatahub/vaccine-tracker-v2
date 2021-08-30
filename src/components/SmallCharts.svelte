<section id="small-charts">
  <div class="chart">Chart</div>
  <div class="chart">Chart</div>
  <div class="chart">Chart</div>
  <div class="chart">Chart</div>
</section>

<style>
  #small-charts {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
    margin-top: 30px;
  }
  .chart {
    padding: 20px;
    background: #fff;
    border-radius: 6px;
  }
</style>
