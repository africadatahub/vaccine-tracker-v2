import React,{useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { GlobalContext } from '../context/GlobalState';
import Close from '../svg/times.svg';
import chartData from '../control/chartData';
import raw from '../data/countries.json'
export default function CountrySelect() {
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [selected, setSelected] = useState([])
    const [sources, setSources] = useState([])
    const [types, setTypes] = useState([])
    const {countries, setCountries, setMapCountries, series, setSeries, death_series, setDeathSeries,selected_cases_count,selected_deaths_count,
        setSelectedCountries,setDonated, setCovax, setBought,setAllNewCases,all_new_cases,setCountCases,setCountDeaths,sinovac,setSinovac,
        setAfricaDeathCount,setAfricaCasesCount, setRegionalDeathCount, setRegionalCasesCount,
        setJJ,setSputnik,
        setCovaxin,
        setPfizer,
        setOx,setSinopharm,
        setModerna,
        covax,donated,bought,
        covaxin, jj, sinopharm, sputnik, moderna, pfizer, ox_a} = useContext(GlobalContext)
    const{fetchData} = chartData()
    const toggle = () => {
        setDropDownOpen(!dropDownOpen)
    }
    const regions =   ['West Africa','North Africa', 'Southern Africa', 'Central Africa', 'East Africa']

    const selectSources =(iso_code,sources)=>{
        var selected_regions_iso = selected.map(a => a.iso);
        if(!selected_regions_iso.includes(iso_code)){
            selected_regions_iso.push(iso_code)
        }
        const selected_regions_sources = sources.filter(source=>{return selected_regions_iso.includes(source.iso_code)})
        //console.log('sources selected_regions_iso', selected_regions_iso)
       // console.log('sources selected_regions_sources', selected_regions_sources)
        let d =0
        let c =0
        let b=0
        for(let i=0; i<selected_regions_sources.length; i++){
            if(selected_regions_sources[i].iso_code=='OWID_AFR'){
                d = parseInt( selected_regions_sources[i].donated ? selected_regions_sources[i].donated : 0)
                c =  parseInt(selected_regions_sources[i].covax ? selected_regions_sources[i].covax : 0)
                b = parseInt(selected_regions_sources[i].bought ? selected_regions_sources[i].bought : 0) 
                break
            }
            else if(regions.includes(selected_regions_sources[i].iso_code)){
                d = d + parseInt( selected_regions_sources[i].donated ? selected_regions_sources[i].donated : 0)
                c = c + parseInt(selected_regions_sources[i].covax ? selected_regions_sources[i].covax : 0)
                b = b + parseInt(selected_regions_sources[i].bought ? selected_regions_sources[i].bought : 0) 
            }
            else if(!selected_regions_iso.includes(selected_regions_sources[i].region)){
                d = d + parseInt( selected_regions_sources[i].donated ? selected_regions_sources[i].donated : 0)
                c = c + parseInt(selected_regions_sources[i].covax ? selected_regions_sources[i].covax : 0)
                b = b + parseInt(selected_regions_sources[i].bought ? selected_regions_sources[i].bought : 0) 
            }
        }
        setDonated(d)
        setCovax(c)
        setBought(b)
    }
    const removeSources =(iso_code, new_selected)=>{
        var selected_regions_iso = new_selected.map(a => a.iso);
        selected_regions_iso = selected_regions_iso.filter(iso=>{return iso != iso_code})
        const selected_regions_sources = sources.filter(source=>{return selected_regions_iso.includes(source.iso_code)})
        let d =0
        let c =0
        let b=0
        for(let i=0; i<selected_regions_sources.length; i++){
            if(selected_regions_sources[i].iso_code=='OWID_AFR'){
                d = parseInt( selected_regions_sources[i].donated ? selected_regions_sources[i].donated : 0)
                c =  parseInt(selected_regions_sources[i].covax ? selected_regions_sources[i].covax : 0)
                b = parseInt(selected_regions_sources[i].bought ? selected_regions_sources[i].bought : 0) 
                break
            }
            else if(regions.includes(selected_regions_sources[i].iso_code)){
                d = d + parseInt( selected_regions_sources[i].donated ? selected_regions_sources[i].donated : 0)
                c = c + parseInt(selected_regions_sources[i].covax ? selected_regions_sources[i].covax : 0)
                b = b + parseInt(selected_regions_sources[i].bought ? selected_regions_sources[i].bought : 0) 
            }
            else if(!selected_regions_iso.includes(selected_regions_sources[i].region)){
                d = d + parseInt( selected_regions_sources[i].donated ? selected_regions_sources[i].donated : 0)
                c = c + parseInt(selected_regions_sources[i].covax ? selected_regions_sources[i].covax : 0)
                b = b + parseInt(selected_regions_sources[i].bought ? selected_regions_sources[i].bought : 0) 
            }
        }
        setDonated(d)
        setCovax(c)
        setBought(b)
    }
    const selectTypes = (iso_code, types) =>{
        var selected_regions_iso = selected.map(a => a.iso);
        if(!selected_regions_iso.includes(iso_code)){
            selected_regions_iso.push(iso_code)
        }
        const selected_regions_types= types.filter(type=>{return selected_regions_iso.includes(type.iso_code)})
        var c =0
        var m =0
        var j = 0
        var o = 0
        var p = 0
        var s = 0
        var sp = 0
        var si = 0
        for(let i=0; i<selected_regions_types.length; i++){
            if(selected_regions_types[i].iso_code=='OWID_AFR'){
              c = parseInt( selected_regions_types[i].Covaxin ? selected_regions_types[i].Covaxin :0 )
              m = parseInt( selected_regions_types[i].Moderna ? selected_regions_types[i].Moderna: 0  )
              j = parseInt( selected_regions_types[i].Johnson_and_Johnson ? selected_regions_types[i].Johnson_and_Johnson : 0)
              o = parseInt( selected_regions_types[i].Oxford_AstraZeneca ? selected_regions_types[i].Oxford_AstraZeneca : 0 )
              p = parseInt( selected_regions_types[i].Pfizer_BioNTech ? selected_regions_types[i].Pfizer_BioNTech  : 0 )
              s = parseInt( selected_regions_types[i].Sinopharm ? selected_regions_types[i].Sinopharm : 0 )
              sp = parseInt( selected_regions_types[i].Sputnik_V ? selected_regions_types[i].Sputnik_V : 0)
              si = parseInt( selected_regions_types[i].Sinovac ? selected_regions_types[i].Sinovac : 0)
              break
            }
            else if(regions.includes(selected_regions_types[i].iso_code)){
                c = c + parseInt( selected_regions_types[i].Covaxin ? selected_regions_types[i].Covaxin :0 )
                m = m + parseInt( selected_regions_types[i].Moderna ? selected_regions_types[i].Moderna: 0  )
                j = j + parseInt( selected_regions_types[i].Johnson_and_Johnson ? selected_regions_types[i].Johnson_and_Johnson : 0)
                o = o + parseInt( selected_regions_types[i].Oxford_AstraZeneca ? selected_regions_types[i].Oxford_AstraZeneca : 0 )
                p = p + parseInt( selected_regions_types[i].Pfizer_BioNTech ? selected_regions_types[i].Pfizer_BioNTech  : 0 )
                s = s + parseInt( selected_regions_types[i].Sinopharm ? selected_regions_types[i].Sinopharm : 0 )
                sp = sp + parseInt( selected_regions_types[i].Sputnik_V ? selected_regions_types[i].Sputnik_V : 0)
                si = si + parseInt( selected_regions_types[i].Sinovac ? selected_regions_types[i].Sinovac : 0)
            }
            else if(!selected_regions_iso.includes(selected_regions_types[i].region)){
                c = c + parseInt( selected_regions_types[i].Covaxin ? selected_regions_types[i].Covaxin :0 )
                m = m + parseInt( selected_regions_types[i].Moderna ? selected_regions_types[i].Moderna: 0  )
                j = j + parseInt( selected_regions_types[i].Johnson_and_Johnson ? selected_regions_types[i].Johnson_and_Johnson : 0)
                o = o + parseInt( selected_regions_types[i].Oxford_AstraZeneca ? selected_regions_types[i].Oxford_AstraZeneca : 0 )
                p = p + parseInt( selected_regions_types[i].Pfizer_BioNTech ? selected_regions_types[i].Pfizer_BioNTech  : 0 )
                s = s + parseInt( selected_regions_types[i].Sinopharm ? selected_regions_types[i].Sinopharm : 0 )
                sp = sp + parseInt( selected_regions_types[i].Sputnik_V ? selected_regions_types[i].Sputnik_V : 0)
                si = si + parseInt( selected_regions_types[i].Sinovac ? selected_regions_types[i].Sinovac : 0)
            }
        }
        setCovaxin(c)
        setModerna(m)
        setJJ(j)
        setOx(o)
        setPfizer(p)
        setSinopharm(s)
        setSputnik(sp)
        setSinovac(si)
    }
    const removeType = iso_code =>{
        var selected_regions_iso = selected.map(a => a.iso);
        selected_regions_iso = selected_regions_iso.filter(iso=>{return iso != iso_code})
        const selected_regions_types= types.filter(type=>{return selected_regions_iso.includes(type.iso_code)})
        var c =0
        var m =0
        var j = 0
        var o = 0
        var p = 0
        var s = 0
        var sp = 0
        var si = 0
        for(let i=0; i<selected_regions_types.length; i++){
            if(selected_regions_types[i].iso_code=='OWID_AFR'){
              c = parseInt( selected_regions_types[i].Covaxin ? selected_regions_types[i].Covaxin :0 )
              m = parseInt( selected_regions_types[i].Moderna ? selected_regions_types[i].Moderna: 0  )
              j = parseInt( selected_regions_types[i].Johnson_and_Johnson ? selected_regions_types[i].Johnson_and_Johnson : 0)
              o = parseInt( selected_regions_types[i].Oxford_AstraZeneca ? selected_regions_types[i].Oxford_AstraZeneca : 0 )
              p = parseInt( selected_regions_types[i].Pfizer_BioNTech ? selected_regions_types[i].Pfizer_BioNTech  : 0 )
              s = parseInt( selected_regions_types[i].Sinopharm ? selected_regions_types[i].Sinopharm : 0 )
              sp = parseInt( selected_regions_types[i].Sputnik_V ? selected_regions_types[i].Sputnik_V : 0)
              si = parseInt( selected_regions_types[i].Sinovac ? selected_regions_types[i].Sinovac : 0)
              break
            }
            else if(regions.includes(selected_regions_types[i].iso_code)){
                c = c + parseInt( selected_regions_types[i].Covaxin ? selected_regions_types[i].Covaxin :0 )
                m = m + parseInt( selected_regions_types[i].Moderna ? selected_regions_types[i].Moderna: 0  )
                j = j + parseInt( selected_regions_types[i].Johnson_and_Johnson ? selected_regions_types[i].Johnson_and_Johnson : 0)
                o = o + parseInt( selected_regions_types[i].Oxford_AstraZeneca ? selected_regions_types[i].Oxford_AstraZeneca : 0 )
                p = p + parseInt( selected_regions_types[i].Pfizer_BioNTech ? selected_regions_types[i].Pfizer_BioNTech  : 0 )
                s = s + parseInt( selected_regions_types[i].Sinopharm ? selected_regions_types[i].Sinopharm : 0 )
                sp = sp + parseInt( selected_regions_types[i].Sputnik_V ? selected_regions_types[i].Sputnik_V : 0)
                si = si + parseInt( selected_regions_types[i].Sinovac ? selected_regions_types[i].Sinovac : 0)
            }
            else if(!selected_regions_iso.includes(selected_regions_types[i].region)){
                c = c + parseInt( selected_regions_types[i].Covaxin ? selected_regions_types[i].Covaxin :0 )
                m = m + parseInt( selected_regions_types[i].Moderna ? selected_regions_types[i].Moderna: 0  )
                j = j + parseInt( selected_regions_types[i].Johnson_and_Johnson ? selected_regions_types[i].Johnson_and_Johnson : 0)
                o = o + parseInt( selected_regions_types[i].Oxford_AstraZeneca ? selected_regions_types[i].Oxford_AstraZeneca : 0 )
                p = p + parseInt( selected_regions_types[i].Pfizer_BioNTech ? selected_regions_types[i].Pfizer_BioNTech  : 0 )
                s = s + parseInt( selected_regions_types[i].Sinopharm ? selected_regions_types[i].Sinopharm : 0 )
                sp = sp + parseInt( selected_regions_types[i].Sputnik_V ? selected_regions_types[i].Sputnik_V : 0)
                si = si + parseInt( selected_regions_types[i].Sinovac ? selected_regions_types[i].Sinovac : 0)
            }
        }
        setCovaxin(c)
        setModerna(m)
        setJJ(j)
        setOx(o)
        setPfizer(p)
        setSinopharm(s)
        setSputnik(sp)
        setSinovac(si)
    }

    //Load selected values
    const onChange = (choice) => {
        if(countries.filter(country=>{return country.countries == choice}).length > 0) {
        if(selected.length <10){
            const selected_country = countries.filter(country=>{return country.countries == choice})
            const new_countries = countries.filter(country=>{return country.countries != choice})
    
            
            setSelected(selected => [...selected, selected_country[0]]);
            setSelectedCountries([...selected, selected_country[0]]);
            setCountries(new_countries)
            fetchData(selected_country[0].iso, selected_country[0].countries )
            selectSources(selected_country[0].iso, sources)
            selectTypes(selected_country[0].iso, types)

        }
        else{
            alert("You can only select maximum of 10 countries")
        }
    }
    }


    //remove value
    const remove = (choice) => {
        
        const removed_country = selected.filter(country=>{return country.countries == choice})[0]
        const new_selected = selected.filter(country=>{return country.countries != choice})
        const new_series = series.filter(ser=>{return ser.name != removed_country.countries})
        const new_death_series = death_series.filter(ser=>{return ser.name != removed_country.countries})
        const new_count = all_new_cases.filter(item=>{return item.country != choice})

        const new_all = all_new_cases.filter(ser=>{return ser.country != removed_country.countries})
        
        setSelected(new_selected)
        setSelectedCountries(new_selected)
        setAllNewCases(new_all)
        let add_country = [...countries, removed_country]
        add_country.sort((a, b) => a.countries.localeCompare(b.countries))
        setCountries(add_country)
        setSeries(new_series)
        setDeathSeries(new_death_series)
        removeType(removed_country.iso)
        removeSources(removed_country.iso,new_selected)

        let deaths_count = 0
        let cases_count = 0
        let region_deaths_count = 0
        let region_cases_count = 0
        let africa_deaths_count = 0
        let africa_cases_count = 0
        for( let i=0; i<new_count.length; i++){

            if(new_count[i].country == 'Africa'){
                let count = 1
                while(isNaN(africa_deaths_count) || (africa_deaths_count ==0) ){
                    africa_deaths_count = 0
                    count = count +1
                    africa_deaths_count = africa_deaths_count + parseInt(new_count[i].result[new_count[i].result.length - count] ? new_count[i].result[new_count[i].result.length - count]['total_deaths']  : 0)
                    if(count == new_count[i].result.length ){
                        break
                    }
                }
                count =1
                while(isNaN(africa_cases_count) || (africa_cases_count ==0) ){
                    africa_cases_count = 0
                    count = count + 1
                    africa_cases_count = africa_cases_count + parseInt(new_count[i].result[new_count[i].result.length - count] ? new_count[i].result[new_count[i].result.length - count]['total_cases']  : 0)
                    if(count == new_count[i].result.length ){
                        break
                    }
                }

            }
            else if(regions.includes(new_count[i].country)){
                
                let count = 1

                while(isNaN(region_deaths_count) || (region_deaths_count ==0) ){
                    region_deaths_count = 0
                    count = count +1
                    region_deaths_count = region_deaths_count + parseInt(new_count[i].result[new_count[i].result.length - count] ? new_count[i].result[new_count[i].result.length - count]['total_deaths']  : 0)
                    if(count == new_count[i].result.length ){
                        break
                    }
                }
                count =1
                while(isNaN(region_cases_count) || (region_cases_count ==0) ){
                    region_cases_count = 0
                    count = count + 1
                    region_cases_count = region_cases_count + parseInt(new_count[i].result[new_count[i].result.length - count] ? new_count[i].result[new_count[i].result.length - count]['total_cases']  : 0)
                    if(count == new_count[i].result.length ){
                        break
                    }
                }

            }
            else{
                
                let count = 1

                while(isNaN(deaths_count) || (deaths_count ==0) ){
                    region_dedeaths_countaths_count = 0
                    count = count +1
                    deaths_count = deaths_count + parseInt(new_count[i].result[new_count[i].result.length - count] ? new_count[i].result[new_count[i].result.length - count]['total_deaths']  : 0)
                    if(count == new_count[i].result.length ){
                        break
                    }
                }
                count =1
                while(isNaN(cases_count) || (cases_count ==0) ){
                    cases_count = 0
                    count = count + 1
                    cases_count = cases_count + parseInt(new_count[i].result[new_count[i].result.length - count] ? new_count[i].result[new_count[i].result.length - count]['total_cases']  : 0)
                    if(count == new_count[i].result.length ){
                        break
                    }
                }
            }

        }
        setCountCases(cases_count)
        setCountDeaths(deaths_count)
        setRegionalDeathCount(region_deaths_count)
        setRegionalCasesCount(region_cases_count)
        setAfricaDeathCount(africa_deaths_count)
        setAfricaCasesCount(africa_cases_count)


    }
    const getCountries = ()=>{
        const ALL_COUNTRIES_API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search?resource_id=9b82b5e7-5f30-4055-9875-09fb8d09d1d9&limit=1000'
        axios.get(ALL_COUNTRIES_API)
        .then(response=>{
            let add_country = response.data.result.records
            
            const africa = add_country.filter(country=>{return country.countries == "Africa"})[0]
            let new_contries = add_country.filter(country=>{return country.countries != "Africa"})
            new_contries.sort((a, b) => a.countries.localeCompare(b.countries))
            
            if(africa){
                fetchData(africa.iso,africa.countries)
                setSelected([{
                    iso:"OWID_AFR",
                    countries:"Africa"
                }]);
                setSelectedCountries([{
                    iso:"OWID_AFR",
                    countries:"Africa"
                }]);
            }

          setCountries(new_contries)
          setMapCountries(response.data)
          
        })
      }
    
    const getSources = ()=>{
        const QUERY = `sql=SELECT * from "5d2a0173-ea91-4b90-bf08-bb5c467a300e"`
        const API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?'

        axios.get(API + QUERY )
        .then(response=>{
            setSources(response.data.result.records)
           selectSources("OWID_AFR", response.data.result.records)
        })
    }

    const getTypes = ()=>{
        const API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search?resource_id=12cdfde4-5e39-4ed8-a6d3-b226f2a76f39'
        axios.get(API)
        .then(response=>{
            setTypes(response.data.result.records)
            selectTypes("OWID_AFR", response.data.result.records)
        })
    }
      
      useEffect(()=>{
        getCountries()
        getSources()
        getTypes()
        
      },[])

    return (
        <div>
            <Dropdown isOpen={dropDownOpen} toggle={toggle} >
                <DropdownToggle caret style={{backgroundColor:'#235563'}}>Choose Country</DropdownToggle>
                <DropdownMenu>
                    {raw.map((country, i) => (
                        <>
                        {i  < 1 ?
                       <>
                         <DropdownItem key={i} onClick={() => onChange(country.countries)} disabled={selected.length > 9 && true}>
                           {country.countries}
                       </DropdownItem>
                       <hr/>
                       </>
                       : i === 5 ?
                       <>
                       <DropdownItem key={i} onClick={() => onChange(country.countries)} disabled={selected.length > 9 && true}>
                         {country.countries}
                     </DropdownItem>
                     <hr/>
                     </>
                     :
                       <DropdownItem key={i} onClick={() => onChange(country.countries)} disabled={selected.length > 9 && true}>
                       {country.countries}
                   </DropdownItem>
                       }
                       </>
                    ))}
                </DropdownMenu>
            </Dropdown>

            <div className="panel--selected row">
                {selected &&
                    selected.map((data, i) => (
                        <div className="selected" key={i}><span>{data.countries}</span> <a onClick={() => remove(data.countries)}><img src={Close} alt='close button' /></a></div>
                    ))}
            </div>
        </div>
    )
}
