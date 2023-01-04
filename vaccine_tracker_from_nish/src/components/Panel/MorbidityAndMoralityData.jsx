import React, { useContext, useEffect, useState } from 'react'
import './panel.scss';
import './table.scss';
import Map from '../map/Map';
import LineChart from '../charts/Linechart';
import CountrySelect from '../CountrySelect';
import FilterByYear from '../FilterByYear';
import Info from '../infoPopUp/infoPopUp'
import CountUp from "react-countup";
import axios from 'axios';
import { GlobalContext } from '../../context/GlobalState';

const Panel = () => {
  const paragraph = 'This map displays the total number of deaths caused by COVID-19 in each country, with the darker shades indicating a higher numbers of deaths and the lighter shades indicating a lower number of deaths. When hovering your mouse over a particular country, you will see the total number of deaths and the total number of cases for that particular country. Note, the shading of the country does not indicate total cases, only total deaths.'
  
  const {series, death_series, selected_deaths_count, selected_cases_count,selected_countries,
    regional_total_cases_count, africa_total_cases_count,regional_total_deaths_count,africa_total_deaths_count,} = useContext(GlobalContext)
  const [countries, setCountries] = useState([])
  const [no_death, setDeath] = useState([])
  const [new_cases, setCases] = useState([])

  const getData = async (iso, country)=>{
    const QUERY = `sql=SELECT * from "282ea4bf-e3d6-4ce8-8efa-5d256c851695" WHERE iso_code LIKE '${iso}'`
    const API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?'
    const response = await axios.get(API + QUERY)
    if(response){
      let data = response.data.result.records
      let count_newCases = 0
      let count_newDeaths = 0
      for(let i =0; i<data.length; i++){
          count_newCases = count_newCases + (parseInt(data[i].new_cases) ? parseInt(data[i].new_cases) : 0)
          count_newDeaths = count_newDeaths + (parseInt(data[i].new_deaths) ? parseInt(data[i].new_deaths) : 0)
      }
      const cases = new_cases.filter(item=>{return item.iso_code == iso })
      const death = no_death.filter(item=>{return item.iso_code == iso })
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
    const ALL_COUNTRIES_API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search?resource_id=9b82b5e7-5f30-4055-9875-09fb8d09d1d9&limit=1000'
    await axios.get(ALL_COUNTRIES_API)
    .then(response=>{
        let add_country = response.data.result.records
        add_country.sort((a, b) => a.countries.localeCompare(b.countries))
      setCountries(add_country)
      for(let i=0; i<add_country.length; i++){
        getData(add_country[i].iso, add_country[i].countries)
      }
    })
  }
  useEffect(async ()=>{
    await getCountries()
  },[])



  return (
    <div className="panel">
      <div className="d-md-flex filter-container">
        <div className="col-md-6">
          <CountrySelect />
        </div>
        <div className="col-md-6">
            <FilterByYear/>
        </div>
      </div>
      <div className="data-viz">
        <div className="d-md-flex">
          <div className="col-md-6">
          <div className="data-viz--card left">
              <div className='header m25'>Overview Stats: Cases & Deaths</div>
              <div className='body'>
                  <div className='body--container'>
                    <table>
                        <tr>
                            <th></th>
                            <th>Confirmed Cases</th>
                            <th>Deaths</th>
                        </tr>
                        {
                          africa_total_cases_count || africa_total_deaths_count ?
                        <tr>
                            <td className='text-left'>Africa Total:</td>
                            <td><span className='confirmed'><CountUp start={0} end={africa_total_cases_count} duration={2} separator=" " /></span></td>
                            <td><span className='deaths'><CountUp start={0} end={africa_total_deaths_count} duration={2} separator=" " /></span></td>
                        </tr>:""
                        }
                        {regional_total_cases_count ||regional_total_deaths_count ?
                        <tr>
                            <td className='text-left'>Region Total:</td>
                            <td><span className='confirmed'><CountUp start={0} end={regional_total_cases_count} duration={2} separator=" " /></span></td>
                            <td><span className='deaths'><CountUp start={0} end={regional_total_deaths_count} duration={2} separator=" " /></span></td>
                        </tr>:""
                        }
                        {
                          selected_cases_count||selected_deaths_count ?
                        <tr>
                            <td className='text-left'>Countries Total:</td>
                            <td><span className='confirmed'><CountUp start={0} end={selected_cases_count} duration={2} separator=" " /></span></td>
                            <td><span className='deaths'><CountUp start={0} end={selected_deaths_count} duration={2} separator=" " /></span></td>
                        </tr>:""
                        }
                        
                    </table>
                      {/* <div>
                          <h1 className='confirmed'><CountUp start={0} end={selected_cases_count} duration={2} separator=" " /> </h1>
                          <label>Confirmed Cases</label>
                    </div>
                    <div>
                          <h1 className='deaths'><CountUp start={0} end={selected_deaths_count} duration={2} separator=" " /></h1>
                          <label>Deaths</label>
                    </div> */}
                  </div>
              </div>
            </div>
            <div className="data-viz--card left mb-0">
              <div className='header m38 d-flex'>Total Deaths <Info explainer={paragraph}/></div>
              <div className='body'><Map mapCountries={countries} new_cases={new_cases} no_death={no_death}/></div>
              <div className='footer'>
                 <p>Source: <a href='https://ourworldindata.org' target="_blank">Our World in Data</a></p>
                 <div>
                    {/* <a className="share" href="#">Share</a> */}
                    <a className='download' href="https://ckandev.africadatahub.org/dataset/93a3bb2b-528a-4713-b35b-f89b9c2716d0/resource/282ea4bf-e3d6-4ce8-8efa-5d256c851695/download/df_ow.csv">Download data</a>
                 </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="data-viz--card right">
            <div className='header m25'>Number of Cases</div>
            <div className='body'>{series ?<LineChart min={0} max={3000} name="Cases" nameGap={40} series={series} />:"Select a country" } </div>
            <div className='footer'>
                 <p>Source: <a href='https://ourworldindata.org' target="_blank">Our World in Data</a></p>
                 <div>
                    <a className='share' href="#">Share</a>
                    <a className='download' target={"_blank"} href="https://ckandev.africadatahub.org/dataset/93a3bb2b-528a-4713-b35b-f89b9c2716d0/resource/282ea4bf-e3d6-4ce8-8efa-5d256c851695/download/df_ow.csv">Download data</a>
                 </div>
              </div>
            </div>
            <div className="data-viz--card right mb-0">
            <div className='header m25'>Number of Deaths</div>
            <div className='body'><LineChart min={0} max={7000} name="Deaths" nameGap={40} series={death_series}/></div>
            <div className='footer'>
                 <p>Source: <a href='https://ourworldindata.org' target="_blank">Our World in Data</a></p>
                 <div>
                    <a className='share' href="#">Share</a>
                    <a className='download' target={"_blank"} href="https://ckandev.africadatahub.org/dataset/93a3bb2b-528a-4713-b35b-f89b9c2716d0/resource/282ea4bf-e3d6-4ce8-8efa-5d256c851695/download/df_ow.csv">Download data</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Panel;