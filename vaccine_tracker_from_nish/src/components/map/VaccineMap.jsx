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
    const [loading, setLoading] = useState(true)

    const small_screen = width <= 768;
    const onEachFeature = (feature, layer) => {
        layer.on({
            mouseover: hover,
           // mousemove: move,
            mouseout: out,
            click: click,
        })
    }
    const mapStyle = (feature) => {
        let fillColor = '#ffffff'
        let iso = feature.properties.ADM0_A3 
        let countryData = mapCountries.filter(item=>{return item.iso_code == iso})[0]

        if(countryData != undefined) {
            if(countryData.per_100){
                fillColor = absScale.getColor(countryData.per_100);
                
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
        const total_doses = mapCountries.filter(item=>{return item.iso_code == iso})[0]
        const per_100 = mapCountries.filter(item=>{return item.iso_code == iso})[0]
        
        let flag
        try {
            flag = convertCode(
                feature.target.feature.properties.ADM0_A3
              )[0].iso_2.toLowerCase()
        }catch(e){

        }

        flag = `https://hosted.mediahack.co.za/flags/${flag}.svg`
        let tooltipC = `<div class='title'><div class="flag"></div>
        <div class="title-text">${feature.target.feature.properties.NAME_LONG}</div><br>
        <div class="vaccine-stats"><span class="vaccine-title">Vaccinations per 100 : <span class="vaccine-digit" style="font-weight: 400;">${per_100 ? parseFloat(per_100.per_100).toFixed(2) : null}</span></span></div><br>
        <div class="vaccine-stats"><span class="vaccine-title">Total Vaccinations : <span class="vaccine-digit" style="font-weight: 400;">${ total_doses ? total_doses.total_doses.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") : null}</span></span></div>
        
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
            //maxZoom: small_screen ? 2 : 16,
        }).setView([0, 0], 14)
        // var map = L.map('map').setView([51.505, -0.09], 13)
        let abs = absScale
        abs = abs.setGradient('#fdebec','#329bc2').setMidpoint(100)
        setAbsScale(abs)

        let africa_map = L.geoJSON(africa, {
            onEachFeature: onEachFeature,
            style: mapStyle,
        }).addTo(map)
        map.fitBounds(africa_map.getBounds())
        map.invalidateSize();
        let buckets = '<div class="d-flex"><div class="map-legend-bucket first" style="background: ' + absScale.getColor(100) + '"></div><span class="legend-text">80 - 100+</span></div><div class="d-flex"><div class="map-legend-bucket" style="background: ' + absScale.getColor(75) + '"></div><span class="legend-text">60 - 80</span></div><div class="d-flex"><div class="map-legend-bucket" style="background: ' + absScale.getColor(50) + '"></div><span class="legend-text">40 - 60</span></div><div class="d-flex"><div class="map-legend-bucket" style="background: ' + absScale.getColor(25) + '"></div><span class="legend-text">20 - 40</span></div><div class="d-flex"><div class="map-legend-bucket last" style="background: ' + absScale.getColor(1) + '"></div><span class="legend-text">0 - 20</span></div>';
        document.querySelector('.map-legend-buckets').insertAdjacentHTML('beforeend', buckets);
        //setMap(map)
    }catch(e){console.log(e)}
    }


    useEffect(() => {
        if (mapCountries.length > 0){
            setLoading(false)
            loadMap()
        }
    }, [mapCountries])

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

