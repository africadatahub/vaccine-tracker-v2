import React, { useEffect, useState,useContext } from "react"
import L from 'leaflet';
import Gradient from 'javascript-color-gradient';
import { africa } from "../../data/africajson";
import { countryCodes } from "../../data/country-codes";
import { LeapFrog } from '@uiball/loaders'
import './map.scss'
import { GlobalContext } from "../../context/GlobalState";
import axios from "axios";

const AfricaMap = ({mapCountries,new_cases, no_death}) => {
    const [map, setMap] = useState()
    const[absScale, setAbsScale] = useState(new Gradient())
    const [tooltipContent, setTooltipContent] = useState()
    const [total_death, setTotalDeath] = useState([])
    const [width, setWidth] = useState(window.innerWidth);
    
    const small_screen = width <= 768;
    const [loading, setLoading] = useState(true)

    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: hover,
           // mousemove: move,
            mouseout: out,
            click: click,
        })
    }
    const mapStyle = (feature) => {
        let fillColor = '#a6cee3'
        let iso = feature.properties.ADM0_A3 
        let countryData = no_death.filter(item=>{return item.iso_code == iso})[0]

        if(countryData != undefined) {
            if(countryData.count){
                fillColor = absScale.getColor(countryData.count);
            }
        }

        let borderColor = '#FFFFFF'
        return {
            backgroundColor:borderColor,
            color: borderColor,
            fillColor: fillColor,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            apiUrl: '',
            className: feature.properties.ADM0_A3 + ' country',
        }
    }


    const hover = (feature) => {
        let left = `${feature.originalEvent.clientX + 10}px`;
        let top = `${feature.originalEvent.clientY + 10}px`;
        //Set current overview to hovered country
        let iso = feature.target.feature.properties.ADM0_A3
        const death = no_death.filter(item=>{return item.iso_code == iso})[0]
        const cases = new_cases.filter(item=>{return item.iso_code == iso})[0]
        //this.getCurrentHover(iso)
        let flag
        try {
            flag = convertCode(
                feature.target.feature.properties.ADM0_A3
              )[0].iso_2.toLowerCase()
        }catch(e){

        }

        flag = `https://hosted.mediahack.co.za/flags/${flag}.svg`
        let currentHover = {
            total_vaccinations_per_hundred: 0,
            total_vaccinations: 1000000
        }
        let tooltipC = `<div class='title'><div class="flag"></div>
        <div class="title-text">${feature.target.feature.properties.NAME_LONG}</div><br>
        <div class="vaccine-stats"><span class="vaccine-title">Total number of deaths : <span class="vaccine-digit" style="font-weight: 400;">${ death ? death.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : null}</span></span></div><br>
        <div class="vaccine-stats"><span class="vaccine-title">Total number of cases : <span class="vaccine-digit" style="font-weight: 400;">${cases ? cases.count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : null}</span></span></div>
        </div>`
        

        let tooltip = document.querySelector('.tooltip')
        tooltip.innerHTML = tooltipC
        tooltip.style.display = 'block'
        tooltip.style.opacity = 1
        tooltip.style.left = left
        tooltip.style.top = top
        //document.querySelector('.' + iso).style.stroke = '#74C573';
        document.querySelector('.' + iso).style.fill = '#ef5b5b'; 

        setTimeout(() => {
            document.querySelector('.flag').style.backgroundImage = `url(${flag})`
        }, 50)
    }

    const convertCode = (inCode) =>{
        let newCode = countryCodes.filter((e) => e.iso_3 === inCode)
        return newCode
      }

    // const move = (feature) => {
    //     let tooltip = document.getElementById('#tooltip')
    //     if(tooltip.style){
    //         tooltip.style.left = feature.originalEvent.clientX + 10 + 'px'
    //         tooltip.style.top = feature.originalEvent.clientY + 10 + 'px'

    //     }
    // }
    const out = (feature) => {
        let tooltip = document.querySelector('.tooltip')
        if(tooltip){
            tooltip.style.display = 'none'
            tooltip.style.opacity = 0
            let iso = feature.target.feature.properties.ADM0_A3
            let originalColor = feature.target.options.fillColor;
            document.querySelector('.' + iso).style.fill = originalColor;
            //document.querySelector('.' + iso).style.stroke = '#FFFFFF';

        }
    }
    const click = (feature) => {
        showCountry(feature.target.feature.properties.ADM0_A3)
    }
    const showCountry = iso => {
        console.log('show country')
     }

    const loadMap = async() => {
        try {
        let map = L.map('map', {
            zoomControl: false,
            scrollWheelZoom: false,
            dragging: false,
            zoomSnap: small_screen ? -1 : 0,
        }).setView([0, 0], 14)
        // var map = L.map('map').setView([51.505, -0.09], 13)
        let abs = absScale
        abs = abs.setGradient('#E5E5E5','#0B1941').setMidpoint(10000)
        setAbsScale(abs)

        let africa_map = L.geoJSON(africa, {
            onEachFeature: onEachFeature,
            style: mapStyle,
        }).addTo(map)
        map.fitBounds(africa_map.getBounds())
        let buckets = '<div class="d-flex"><div class="map-legend-bucket first" style="background: ' + absScale.getColor(10000) + '"></div><span class="legend-text">8000 - 10000+</span></div><div class="d-flex"><div class="map-legend-bucket" style="background: ' + absScale.getColor(7500) + '"></div><span class="legend-text">6000 - 8000</span></div><div class="d-flex"><div class="map-legend-bucket" style="background: ' + absScale.getColor(5000) + '"></div><span class="legend-text">4000 - 6000</span></div><div class="d-flex"><div class="map-legend-bucket" style="background: ' + absScale.getColor(2500) + '"></div><span class="legend-text">2000 - 4000</span></div><div class="d-flex"><div class="map-legend-bucket last" style="background: ' + absScale.getColor(1) + '"></div><span class="legend-text">0 - 2000</span></div>';
        document.querySelector('.map-legend-buckets').insertAdjacentHTML('beforeend', buckets);
        //setMap(map)
    }catch(e){console.log(e)}
    }
    const totalDeath = ()=>{
        axios.get(process.env.DEATH_RATE_API)
        .then(response =>{
            let data = []
            const records = response.data.result.records
            for(let i=0; i<mapCountries.length; i++){
                const total = records.filter(item =>{ return item.iso_code == mapCountries[i].iso_code})[0]
                data.push({
                    country : mapCountries[i].country,
                    value: total ? total.new_deaths : null ,
                    iso_code:mapCountries[i].iso_code
                })
            }
            setTotalDeath(data)
        })
    }

    useEffect(() => {
        if (mapCountries.length > 0 && (new_cases.length == 61)&&(no_death.length == 61) ){
           setLoading(false)
           loadMap()
        }
    }, [mapCountries,new_cases,no_death])

    return (
        <div className="left-main main-box">
            <div className="tooltip" id="tooltip">
            </div>
            {
                loading ? <LeapFrog size={40} speed={2.5}  color="#EF5B5B" />:""
            }
            <div id="map">
                <div className="map-legend">
                    <div className="map-legend-title"></div>
                    <div className="map-legend-tiles">

                        <div className="map-legend-buckets"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AfricaMap