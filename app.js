import Vue from 'vue/dist/vue.esm.js';
import L from 'leaflet';
import * as d3 from 'd3';
import { africa } from './data/africajson';
import { countryCodes } from './data/country-codes';
import Gradient from 'javascript-color-gradient';
import _ from 'lodash';

let parseTime = d3.timeParse('%Y-%m-%d')
let formatDate = d3.timeFormat('%e %B, %Y')

Vue.filter('formatNumber', function (value) {
  return Intl.NumberFormat().format(value)
})
Vue.filter('formatMillions', function (value) {
  return d3.format('.3s')(value).replace(/G/, 'B')
})

Vue.filter('formatDate', function (value) {
  return formatDate(parseTime(value))
})

const vm = new Vue({
  el: '#app',
  data() {
    return {
      sources: ['covax', 'bought', 'donated'],
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
      africaOverviewSource: [],
      africaOverviewTypes: [],
      mapData: [],
      absScale: new Gradient()
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

    async getCurrentHover(iso){
      await fetch(
        `https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-by-country.php?cc=${iso}`
      )
        .then((data) => data.json())
        .then((data) => {
          data[data.length - 1].total_vaccinations =
            data[data.length - 1].total_vaccine_doses_to_date
          data[data.length - 1].total_vaccinations_per_hundred = (
            (+data[data.length - 1].total_vaccine_doses_to_date /
              +data[0].population) *
            100
          ).toFixed(2)
          data[data.length - 1].total_vaccinations = +data[data.length - 1].total_vaccinations
          this.currentHover= data[data.length - 1]
          
        })
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

      this.currentVaccinesBought.covax = +this.currentVaccinesBought.covax
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
      let vaccine_sources = 'https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-sources.php'
      await fetch(
        vaccine_sources
      )
        .then((response) => response.json())
        .then((response) => {
          response.forEach((d) => {
            
            d.covax = +d.covax
            d.bought = +d.bought
            d.donated = +d.donated
            d.grant_total = +d.grand_total
            this.vaccinesBought = d.grant_total
          })
          this.vaccinesBought = response
          this.updateAfricaTypes()
        })
    },
    
    async getVaccinesReceived() {
      await fetch(
        'https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-types.php'
      )
        .then((response) => response.json())
        .then((response) => {
          response.forEach(i=>{
            i.Covaxin = +i.Covaxin
            i.Johnson_and_Johnson = +i.Johnson_and_Johnson
            i.Moderna = +i.Moderna
            i.Oxford_AstraZeneca = +i.Oxford_AstraZeneca
            i.Pfizer_BioNTech = +i.Pfizer_BioNTech
            i.Sinopharm = +i.Sinopharm
            i.Sinovac = +i.Sinovac
            i.Sputnik_V = +i.Sputnik_V
          })
          this.vaccinesReceived = response.filter((d) => d.country !== '')
          
          this.updateAfrica()
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
          this.africaOverviewTypes = data[0]
        })
        this.updateAfricaTypes()
    },

    async getCountries() {
      await fetch(this.countriesUrl)
        .then((data) => data.json())
        .then((data) => {
          this.countries = data.filter((d) => d.location !== 'Saint Helena')
        })
    },

    async addAfricaMap() {

      await fetch('https://api.mediahack.co.za/adh/vaccine-tracker/vaccinations-all-countries-new.php')
      .then((data) => data.json())
      .then((data) => {
        this.mapData = data;
        
        let map = L.map('map', {
          zoomControl: false,
          scrollWheelZoom: false,
          dragging: false,
          zoomSnap: 0.1,
        }).setView([0, 0], 14)
  
        let africaMap = L.geoJSON(africa, {
          onEachFeature: this.onEachFeature,
          style: this.mapStyle,
        }).addTo(map)
        map.fitBounds(africaMap.getBounds());

      })

    },

    hover(feature) {
      let iso = feature.target.feature.properties.ADM0_A3;

      if(iso != 'SAH' && iso != 'ERI' && iso != 'SOL') {

        this.getCurrentHover(iso);

        let flag;

        flag = this.convertCode(iso)[0].iso_2.toLowerCase();
        flag = `https://hosted.mediahack.co.za/flags/${flag}.svg`;

        let countryData = _.find(this.mapData, (d) => { return d.iso_code == iso });

        if(countryData != undefined) {

          let parse = d3.format('.2s');

          this.tooltipContent = `<div class='title'><div class="flag"></div>
          <div class="title-text">${countryData.country}</div><br>
          <div class="vaccine-stats"><span class="vaccine-title">Vaccinations per 100 : <span class="vaccine-digit" style="font-weight: 400;">${parse(parseFloat(countryData.per_100))}</span></span></div><br>
          <div class="vaccine-stats"><span class="vaccine-title">Total Vaccinations : <span class="vaccine-digit" style="font-weight: 400;">${parse(parseFloat(countryData.total_doses).toFixed(2))}</span></span></div>
          </div>`;

          this.tooltip.style.display = 'block';

        }

        document.querySelector('.' + iso).style.fill = '#3A6775';

        setTimeout(() => {
          document.querySelector('.flag').style.backgroundImage = `url(${flag})`
        }, 50)

        }

    },

    move(feature) {
      this.tooltip.style.left = feature.originalEvent.clientX + 10 + 'px'
      this.tooltip.style.top = feature.originalEvent.clientY + 10 + 'px'
    },

    out(feature) {
      
      this.tooltip.style.display = 'none'
      
      let iso = feature.target.feature.properties.ADM0_A3;
      let originalColor = feature.target.options.fillColor;

      document.querySelector('.' + iso).style.fill = originalColor;
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

      let countryData = _.find(this.mapData, (d) => { return d.iso_code == feature.properties.ADM0_A3 });

      if(countryData != undefined) {
        fillColor = this.absScale.getColor(countryData.per_100);
      }
      

      return {
        color: '#eee',
        fillColor: fillColor,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        apiUrl: '',
        className: feature.properties.ADM0_A3 + ' country',
      }
    },



    updateAfrica() {
      let vaccines = [
        'Covaxin',
        'Johnson_and_Johnson',
        'Moderna',
        'Oxford_AstraZeneca',
        'Pfizer_BioNTech',
        'Sinopharm',
        'Sinovac',
        'Sputnik_V',
      ]
      
      vaccines.forEach((v) => {
        let count = 0
        this.vaccinesReceived.forEach((vr) => {
          if(vr[v]){
            count = count + +vr[v]

          }
        })
        this.africaOverview[v] = count
        this.africaOverviewSource = this.africaOverview

      })
      
    },

    updateAfricaTypes() {
      let sources = [
        'covax', 
        'bought', 
        'donated'
      ]
      sources.forEach((v) => {
        let count = 0
        this.vaccinesBought.forEach((vr) => {
          count = count + +vr[v]
        })
        this.africaOverviewTypes[v] = count

      })
    },
  

    embeddedCode(){
      var url = window.location.href;
      var div = document.createElement('textarea');
      var iframe = `<iframe width="700" height="400" src="${url}" frameBorder="0"></iframe>`;
      div.innerHTML = iframe;
      var element = document.getElementById('iframe');
    
      if (!element.hasChildNodes()) {

        element.appendChild(div);
      }
    
      var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
      });
      myModal.show();
    },
  },

  

  mounted() {
    this.tooltip = document.querySelector('.tooltip')
    Promise.all([
      this.getAfricaOverview(),
      this.getVaccinesBought(),
      this.getVaccinesReceived(),
      this.getCountries(),
      this.absScale.setGradient('#FFECEC','#329BC2').setMidpoint(50),
      this.addAfricaMap()
     
    ]).then(() => {
      this.loading = false
    })
  },
})