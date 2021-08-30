import Vue from 'vue/dist/vue.esm.js'
import L from 'leaflet'
import * as d3 from 'd3'
import { africa } from './data/africajson'
import { countryCodes } from './data/country-codes'
import { style, tickStep } from 'd3'

// let numberFormat = new Intl.NumberFormat()
Vue.filter('formatNumber', function (value) {
  return Intl.NumberFormat().format(value)
})
Vue.filter('formatMillions', function (value) {
  return d3.format('.3s')(value).replace(/G/, 'B')
})

const vm = new Vue({
  el: '#app',
  data() {
    return {
      sources: ['Covax', 'bought', 'donated'],
      vaccines: [
        'Covaxin',
        'Johnson & Johnson',
        'Moderna',
        'Oxford-AstraZeneca',
        'Pfizer-BioNTech',
        'Sinopharm',
        'Sinovac',
        'Sputnik V',
      ],
      maxVaccines: 0,
      maxSources: 0,
      max: 30000000,
      loading: true,
      tooltip: null,
      tooltipContent: 'Tooltip',
      currentCountry: 'Africa',
      currentOverview: [],
      currentFlag: 'africa.svg',
      countryDropdown: false,
      countries: [],
      countriesUrl:
        'https://api.mediahack.co.za/vaccine-tracker2-dev/countries.php',
      africaOverview: [],
      vaccinesBought: [],
      vaccinesReceived: [],
      currentVaccinesBought: [],
      currentVaccinesReceived: [],
    }
  },
  methods: {
    getMaxVaccineTypes() {
      this.maxVaccines = 0
      this.vaccines.forEach((d) => {
        if (+this.currentVaccinesReceived[d] > this.maxVaccines)
          this.maxVaccines = +this.currentVaccinesReceived[d]
      })
    },
    getMaxVaccineSources() {
      this.maxSources = 0
      this.sources.forEach((d) => {
        if (+this.currentVaccinesBought[d] > this.maxSources)
          this.maxSources = +this.currentVaccinesBought[d]
      })
    },
    resetSelection() {
      this.currentCountry = 'Africa'
      this.currentFlag = 'africa.svg'
      this.currentOverview = this.africaOverview
    },
    convertCode(inCode) {
      let newCode = countryCodes.filter((e) => e.iso_3 === inCode)
      return newCode
    },
    showCountry(iso) {
      this.currentVaccinesBought = this.vaccinesBought.filter(
        (d) => d.iso_code === iso
      )[0]
      this.currentVaccinesReceived = this.vaccinesReceived.filter(
        (d) => d.iso_code === iso
      )[0]

      this.getMaxVaccineTypes()
      this.getMaxVaccineSources()

      this.currentVaccinesBought.Covax = +this.currentVaccinesBought.Covax
      this.currentVaccinesBought.bought = +this.currentVaccinesBought.bought
      this.currentVaccinesBought.borrowed = +this.currentVaccinesBought.borrowed
      this.currentVaccinesBought.donated = +this.currentVaccinesBought.donated
      this.currentVaccinesBought.grand_total =
        +this.currentVaccinesBought.grand_total

      this.currentFlag = this.convertCode(iso)[0].iso_2.toLowerCase() + '.svg'

      let overview = fetch(
        `https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-by-country.php?cc=${iso}`
      )
        .then((data) => data.json())
        .then((data) => {
          this.currentCountry = data[0].country
          data[data.length - 1].total_vaccinations =
            data[data.length - 1].total_vaccine_doses_to_date
          data[data.length - 1].total_vaccinations_per_hundred = (
            (+data[data.length - 1].total_vaccine_doses_to_date /
              +data[0].population) *
            100
          ).toFixed(2)
          this.currentOverview = data[data.length - 1]
        })
    },
    async getVaccinesBought() {
      await fetch(
        'https://api.datadesk.co.za/csvjson.php?table=africa_vaccines_bought_and_donated_1989143'
      )
        .then((response) => response.json())
        .then((response) => {
          response.forEach((d) => {
            d.Covax = +d.Covax
            d.bought = +d.bought
            d.donated = +d.donated
          })
          this.vaccinesBought = response
        })
    },
    async getVaccinesReceived() {
      await fetch(
        'https://api.datadesk.co.za/csvjson.php?table=vaccines_received_africa_3682450'
      )
        .then((response) => response.json())
        .then((response) => {
          this.vaccinesReceived = response.filter((d) => d.country !== '')
          console.log(this.vaccinesReceived)
        })
    },
    async getAfricaOverview() {
      await fetch(
        'https://api.mediahack.co.za/adh/vaccine-tracker/africa-overview.php'
      )
        .then((data) => data.json())
        .then((data) => {
          data.forEach((d) => {
            d.date_of_report = d.date
          })
          this.africaOverview = data[0]
          this.currentOverview = data[0]
        })
    },
    async getCountries() {
      await fetch(this.countriesUrl)
        .then((data) => data.json())
        .then((data) => {
          this.countries = data
        })
    },

    addAfricaMap() {
      let map = L.map('map', {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        zoomSnap: 0.1,
      }).setView([0, 0], 14)
      // var map = L.map('map').setView([51.505, -0.09], 13)

      let africaMap = L.geoJSON(africa, {
        onEachFeature: this.onEachFeature,
        style: this.mapStyle,
      }).addTo(map)
      map.fitBounds(africaMap.getBounds())
    },
    hover(feature) {
      // this.tooltip.style.left = feature.originalEvent.clientX + 100 + 'px'
      // this.tooltip.style.top = feature.originalEvent.clientY + 100 + 'px'
      let flag = this.convertCode(
        feature.target.feature.properties.ADM0_A3
      )[0].iso_2.toLowerCase()
      flag = `https://hosted.mediahack.co.za/flags/${flag}.svg`

      this.tooltipContent = `<div class='title'><div class="flag"></div>
      <div class="title-text">${feature.target.feature.properties.NAME_LONG}</div>
      </div>`
      // this.tooltipContent += `<div class="tooltip-content">

      // </div>`
      this.tooltip.style.display = 'block'
      let iso = feature.target.feature.properties.ADM0_A3
      document.querySelector('.' + iso).style.fill = '#3A6775'

      setTimeout(() => {
        document.querySelector('.flag').style.backgroundImage = `url(${flag})`
      }, 50)
    },
    move(feature) {
      this.tooltip.style.left = feature.originalEvent.clientX + 10 + 'px'
      this.tooltip.style.top = feature.originalEvent.clientY + 10 + 'px'
    },
    out(feature) {
      this.tooltip.style.display = 'none'
      let iso = feature.target.feature.properties.ADM0_A3
      document.querySelector('.' + iso).style.fill = '#094151'
    },
    click(feature) {
      this.showCountry(feature.target.feature.properties.ADM0_A3)
    },
    onEachFeature(feature, layer) {
      layer.on({
        mouseover: this.hover,
        mousemove: this.move,
        mouseout: this.out,
        click: this.click,
      })
    },
    mapStyle(feature) {
      let fillColor = '#094151'
      let borderColor = '#eee'
      // let country = countryStatus.filter(
      //   (d) => d.iso === feature.properties.ADM0_A3
      // )
      // if (country.length > 0) {
      //   fillColor = mapColor
      // }
      return {
        color: borderColor,
        fillColor: fillColor,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        apiUrl: '',
        className: feature.properties.ADM0_A3 + ' country',
      }
    },
  },
  mounted() {
    this.tooltip = document.querySelector('.tooltip')
    Promise.all([
      this.getAfricaOverview(),
      this.getVaccinesBought(),
      this.getVaccinesReceived(),
      this.getCountries(),
      this.addAfricaMap(),
    ]).then(() => {
      this.loading = false
    })
  },
})
