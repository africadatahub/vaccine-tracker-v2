import React,{useContext, useEffect, useState} from 'react'
import './panel.scss';
import Map from '../map/VaccineMap';
import CountrySelect from '../CountrySelect';
import Info from '../infoPopUp/infoPopUp';
import ProgressBar from '../progressbar/ProgressBar';
import CountUp from "react-countup";
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalState';

export const VCPanel = () => {
  const paragraph = '<iframe width="700" height="400" src="http://localhost:59544/" frameBorder="0"></iframe>'
  const {selected_countries,covax,donated,bought,selected_deaths_count, selected_cases_count,sinovac,
    covaxin, jj, sinopharm, sputnik, moderna, pfizer, ox_a} = useContext(GlobalContext)
  const [countries, setCountries] = useState([])
  const [no_death, setDeath] = useState([])
  const [new_cases, setCases] = useState([])
  const [new_selected, setNewSelected] = useState([])
  const [ population, setPopulation] = useState(0)
  const [ total_doses, setTotalDoses] = useState(0)
  const [maxType, setMaxType]= useState(0)
  const [fully_vac, setFullyVac]= useState(0)
  const [africa_population, setAfricaPop] = useState(0)
  const [africa_totalDoses, setAfricaTotalDoses] = useState(0)
  const [africa_vacPer, setAfricaVacPer] = useState(0)
  const [region_population, setRegionPop] = useState(0)
  const [region_totalDoses, setRegionTotalDoses] = useState(0)
  const [region_vacPer, setRegionVacPer] = useState(0)
  const [country_population, setCountryPop] = useState(0)
  const [country_totalDoses, setCountryTotalDoses] = useState(0)
  const [country_vacPer, setCountryVacPer] = useState(0)

  const colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c',  '#fb9a99','#e31a1c',  '#fdbf6f','#ff7f00', '#cab2d6','#6a3d9a','#ffff99','#b15928']


  const getData = async (iso, country)=>{
    const QUERY = `%22%20WHERE%20iso_code%20LIKE%20%27${iso}%27`
    const response = await axios.get(process.env.DEATH_API + QUERY)
    if(response){
      let data = response.data.result.records
      let count_newCases = 0
      let count_newDeaths = 0
      for(let i =0; i<data.length; i++){
          count_newCases = count_newCases + (parseInt(data[i].new_cases) ? parseInt(data[i].new_cases) : 0)
          count_newDeaths = count_newDeaths + (parseInt(data[i].total_deaths) ? parseInt(data[i].total_deaths) : 0)
      }
      const cases = new_cases.filter(item=>{return item.country == country })
      const death = no_death.filter(item=>{return item.country == country })
      if(cases.length == 0){
          let temp_cases = new_cases
          temp_cases.push(
              {
                  country:country,
                  count:count_newCases,
                  iso_code:iso
              }
          )
          setCases([...temp_cases])
  
      }
      if(death.length == 0){
          let temp_death = no_death
          temp_death.push({
              country:country,
              count:count_newDeaths,
              iso_code:iso
          })
          setDeath([...temp_death])
      }

    }
  }
  const getCountries = async ()=>{
    const COUNTRIES_API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search?resource_id=c10e41a5-ee5f-4271-b8cd-a00733814a9d&limit=1000'
    await axios.get(COUNTRIES_API)
    .then(response=>{
        let add_country = response.data.result.records
        add_country.sort((a, b) => a.country.localeCompare(b.country))
      setCountries(add_country)
      console.log('first country', add_country)
      setAfricaPop(add_country[0].population)
      setAfricaTotalDoses(add_country[0].total_doses)
      setAfricaVacPer((add_country[0].per_100).toFixed(2))
      setNewSelected([add_country[0]])

    })
  }
  useEffect(async ()=>{
    await getCountries()
  },[])

  useEffect( ()=>{
    const regions =   ['West Africa','North Africa', 'Southern Africa', 'Central Africa', 'East Africa']
    let count_pop = 0
    let count_doses = 0
    let africa_count_pop = 0
    let africa_count_doses = 0
    let region_count_pop = 0
    let region_count_doses = 0
    let arr = []
    for(let i=0; i<selected_countries.length; i++){
      const new_countries = countries.filter(item=>{return item.iso_code == selected_countries[i].iso})[0]
      if(new_countries){
        if(new_countries.country == 'Africa'){
          africa_count_pop = africa_count_pop + parseInt(new_countries ? new_countries.population : 0)
          africa_count_doses = africa_count_doses + parseInt(new_countries ? new_countries.total_doses : 0)
        }
        else if(regions.includes(new_countries.country)){
          region_count_pop = region_count_pop + parseInt(new_countries ? new_countries.population : 0)
          region_count_doses = region_count_doses + parseInt(new_countries ? new_countries.total_doses : 0)
        }
        else{
          count_pop = count_pop + parseInt(new_countries ? new_countries.population : 0)
          count_doses = count_doses + parseInt(new_countries ? new_countries.total_doses : 0)
        }
        arr.push(new_countries)
      }
    }
    setNewSelected(arr)

    setAfricaPop(africa_count_pop)
    setAfricaTotalDoses(africa_count_doses)
    setAfricaVacPer((africa_count_doses/africa_count_pop * 100).toFixed(2))

    setRegionPop(region_count_pop)
    setRegionTotalDoses(region_count_doses)
    setRegionVacPer((region_count_doses/region_count_pop * 100).toFixed(2))

    setCountryPop(count_pop)
    setCountryTotalDoses(count_doses)
    setCountryVacPer((count_doses/count_pop * 100).toFixed(2))
    
    
  },[selected_countries])

  

  const progress = ()=>{
    let max = 0
    for(let i=0; i<new_selected.length; i++){
      let current = parseFloat(new_selected[i].per_100)
      if(current > max){
        max = current
      }
    }

    return max
  }

  const embeddedCode = () => {
    //e.preventDefault();
    let url = window.location.href;
    let div = document.createElement('textarea');
    let iframe = `<iframe width="700" height="400" src="${url}" frameBorder="0"></iframe>`;
    div.innerHTML = iframe;
    let element = document.getElementById('iframe');
  
    if (!element.hasChildNodes()) {

      element.appendChild(div);
    }
  
    let myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
      keyboard: false
    });
    myModal.show();
  }


  const maxTypes = ()=>{
    const arr = [jj, pfizer, moderna, ox_a, sinopharm, sputnik,sinovac, covaxin]
    let max = 0;
    for(let i = 0; i < arr.length; i++){
      if(parseInt(arr[i]) > max){
        max = parseInt(arr[i])
      }
    }
    return max
  }
  useEffect( ()=>{
    setMaxType(maxTypes())
  },[jj, pfizer, moderna, ox_a, sinopharm, sputnik,sinovac, covaxin,maxType])
  


  return (
    <div className="panel">
      <div className="d-md-flex">
        <div className="col-md-6">
        <CountrySelect />
        </div>
      
      </div>
      <div className="data-viz">
        <div className="d-md-flex">
          <div className="col-md-6">
          <div className="row">
          <div className="col-md-6">
            <div className="data-viz--card left">
            <p className='sub-header'><strong>Total vaccinations per 100 people</strong></p>
              <div className="chart-number">39.3</div>
            
              <div className="body">
                 
              </div>
            </div>
            </div>
            <div className="col-md-6">
            <div className="data-viz--card right">
            <p className='sub-header'><strong>Total vaccinations</strong></p>
              <div className="chart-number">540 M</div>
            
            </div>
            </div>
            </div>
            <div className="data-viz--card mb-0 left">
              <div className="body map-wrapper">
              <Map mapCountries={countries} new_cases={new_cases} no_death={no_death}/>
              </div>
              <div className="footer">
               
                <p>
                <hr/>
                Source: <a href="https://www.africadatahub.org/" target="_blank">Africa Data Hub (by Media Hack Collective) </a>
                  <hr/>
             
               <strong>What is the Vaccine Tracker?</strong> 
                <br/>
                The Vaccine Tracker shows us how many vaccines each African country has administered and what types of vaccines are available. This vaccine tracker was created to provide nuance and detail for the African context.      <br/>Africa only comes up in the vaccine discussion when talking about how the continent has been neglected in comparison to others, but it is a fairer comparison to look at how African countries compare to one another. Journalists are encouraged to use this interactive dashboard to drill down into country specific data and to compare the different types and amounts of vaccines administered per country.  It also signals when there are gaps in the data for a specific country so that journalists take caution.      <br/>It's the first dashboard of its kind to track the types of vaccines for Africa. Data is drawn from numerous sources, is supplemented with news reports daily and is compiled by Media Hack Collective.<br/><br/>
        Get the embeddeable code below:
</p>
        
                 
              </div>
              {/* style={{ textAlign: 'right', backgroundColor:"lightgrey", margin:'6px'}} */}
              <div className="header" style={{ backgroundColor:"lightgrey", margin:'6px'}}><Info explainer={paragraph} /></div>
            </div>
          </div>

          <div className="col-md-6">
           {/* added section */}
           <br/>
           <br/>
           <br/>
           <br/>
           <br/>
          {/* <div className="data-viz--card right">
              <div className="header m7">Africa</div>
              <p className='sub-header'>(For selected Countries &/or Regions)</p>
              <div className="body">
                  <table>
                      <tr>
                        <th>Last Updated</th>
                        <th>Population: </th>
                        <th>Total Doses: </th>
                        <th>Vacc/100 people:</th>
                        
                      </tr>
                      {
                        africa_population||africa_totalDoses?
                      <tr>
                         <td className='text-left'>Africa Total:</td>
                         <td><CountUp start={0} end={africa_population} duration={2} separator=" " /></td>
                         <td><CountUp start={0} end={africa_totalDoses} duration={2} separator=" " /></td>
                         <td><CountUp start={0} end={africa_vacPer} duration={2} separator="." /></td>
                      </tr>:""
                      }
                      {
                        region_population||region_totalDoses?
                      <tr>
                         <td className='text-left'>Regions Total:</td>
                         <td><CountUp start={0} end={region_population} duration={2} separator=" " /></td>
                         <td><CountUp start={0} end={region_totalDoses} duration={2} separator=" " /></td>
                         <td><CountUp start={0} end={region_vacPer} duration={2} separator="." /></td>
                      </tr>:""
                      }
                      {
                        country_population || country_totalDoses ?
                      <tr>
                         <td className='text-left'>Countries Total:</td>
                         <td><CountUp start={0} end={country_population} duration={2} separator=" " /></td>
                         <td><CountUp start={0} end={country_totalDoses} duration={2} separator=" " /></td>
                         <td><CountUp start={0} end={country_vacPer} duration={2} separator="." /></td>
                      </tr>:""
                      }
                  </table>
              </div>
            </div> */}

            <div className="data-viz--card right">
              <div className="header m25">Africa</div>
              <hr/>
              Last Update: 30 June, 2022 <br/>
              Vaccinations per 100 People
              {new_selected&&new_selected.map((item, index)=>{
                let max_per100 = progress()
                return(
                  <div className="body" key={index} >
                        <div className="progressbar d-flex">
                          <div id={'country'} className={["bar "+'country']} style={{ width: (max_per100 ? parseInt(item.per_100/max_per100 * 100) : 0 )+"%", background:colors[index] }}></div>
                          <div className="first-box-label">{item.country}</div>
                          <div className="first-box-value">{parseInt(item.per_100) }</div>
                        </div>
                        
                    </div>
                )
              })
              }
              <div className="footer">
                <p>
                  Source: <a href="https://www.africadatahub.org/" target="_blank">Africa Data Hub (by Media Hack Collective) 
</a>
                </p>
                {/* <div>
                
                  <a className="download" href="#"  onClick={embeddedCode} class="embed">
                    Embed
                  </a>
                </div> */}
              </div>
            </div>
            <div className="data-viz--card right">
              <div className="header m25">Vaccine sources</div>
              <div className="body">
                    <ProgressBar class='covax'    value={covax} label="Via Covax" bar={covax ? covax / (covax + bought + donated)*100:0}/>
                    <ProgressBar class='bought'   value={bought} label="Bought" bar={bought ? bought / (covax + bought + donated)*100:0}/>
                    <ProgressBar class='donation' value={donated} label="Via Donation" bar={donated ? donated / (covax + bought + donated)*100:0}/>
                    <ProgressBar class='vaccines' value={covax + bought + donated}  label="Total Vaccines Received" bar={(covax + bought + donated)? 100:0}/>
             </div>
              <div className="footer">
                <p>
                  Source: <a href="https://www.africadatahub.org/" target="_blank">Africa Data Hub (by Media Hack Collective) 
</a>
                </p>
       
                </div>
                
              
                 
               
            </div>
            <div className="data-viz--card right">
              <div className="header m25">Vaccine types</div>
              <div className="body">
              <ProgressBar class='covaxin'   value={covaxin} label="Covaxin" bar={ covaxin ? (covaxin / maxType )* 100 : 0}/>
              <ProgressBar class='jj'        value={jj} label="Johnson & Johnson" bar={ jj ? (jj / maxType) * 100 : 0}/>
              <ProgressBar class='moderna'   value={moderna} label="Moderna" bar={ moderna ? (moderna / maxType )* 100 : 0}/>
              <ProgressBar class='astra'     value={ox_a} label="Oxford-AstraZeneca" bar={ ox_a ? (ox_a / maxType) * 100 : 0}/>
              <ProgressBar class='pfizer'    value={pfizer} label="Pfizer-BioNTech" bar={ pfizer ?( pfizer / maxType) * 100 : 0}/>
              <ProgressBar class='sinopharm' value={sinopharm} label="Sinopharm" bar={ sinopharm ? (sinopharm / maxType )* 100 : 0} />
              <ProgressBar class='sputnik'   value={sputnik} label="Sputnik" bar={ sputnik ? (sputnik / maxType) * 100 : 0}/>
              <ProgressBar class='sinopharm' value={sinovac} label="Sinovac" bar={ sinovac ? (sinovac / maxType )* 100 : 0} />
              </div>
              <div className="footer">
              <p>
                  Source: <a href="https://www.africadatahub.org/" target="_blank">Africa Data Hub (by Media Hack Collective) 
</a>
                </p>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
 export default VCPanel;