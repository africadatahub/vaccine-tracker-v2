import { useContext } from "react"
import { GlobalContext } from "../context/GlobalState"
import axios from "axios"

function chartData() {
    const { getRandomColor, setSeries, series, labels,setAllNewCases,all_new_cases, death_series, setDeathSeries 
    ,setCountCases,selected_cases_count,setCountDeaths,selected_deaths_count, setAfricaDeathCount,setAfricaCasesCount,
    setRegionalDeathCount,setRegionalCasesCount,regional_total_deaths_count,regional_total_cases_count } = useContext(GlobalContext)
    const colors = ["#C8E6F6","#F4BB8C","#9BDABA","#FFE79B","#B6B6B6","#D9F0D3","#F5A8A5","#D0D1E6","#74A9CF","#A38BC1"]
    const regions =   ['West Africa','North Africa', 'Southern Africa', 'Central Africa', 'East Africa']
    const africa = 'Africa'
    const fetchData = (iso, country) => {
        const QUERY = `sql=SELECT * from "2b96e383-5363-44fc-931b-017815684ffe" WHERE iso_code LIKE '${iso}'`
        const API = 'https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?'
        axios.get(API + QUERY)
        .then(res=>{
            addCountry(res.data.result.records, labels, country)
            let temp = all_new_cases
            temp.push({
                country:country,
                result:res.data.result.records
            })
            setAllNewCases(temp)

        })
        
    }
    const countTotals = (file_data, country)=>{
        let cases_count = 0
        let deaths_count = 0
        let count = 1
        deaths_count = deaths_count + (file_data[file_data.length -count] ? parseInt(file_data[file_data.length -count]['total_deaths']) :0)
        cases_count = cases_count + (file_data[file_data.length -count] ? parseInt(file_data[file_data.length -count]['total_cases']) :0)

        while(isNaN(deaths_count) || (deaths_count ==0) ){
            deaths_count = 0
            count = count +1
            deaths_count = deaths_count + (file_data[file_data.length -count] ? parseInt(file_data[file_data.length -count]['total_deaths']) :0)
            if(count == file_data.length){
                break
            }
        }
        count =1
        while(isNaN(cases_count) || (cases_count ==0) ){
            cases_count = 0
            count = count + 1
            cases_count = cases_count + (file_data[file_data.length -count] ? parseInt(file_data[file_data.length -count]['total_cases']) :0)
            if(count == file_data.length){
                break
            }
        }

        if(country == africa){
            setAfricaDeathCount(deaths_count)
            setAfricaCasesCount(cases_count)
        }
        else if(regions.includes(country)){
            setRegionalDeathCount(regional_total_deaths_count + deaths_count)
            setRegionalCasesCount(regional_total_cases_count + cases_count )
        }
        else{
            setCountCases(selected_cases_count + cases_count )
            setCountDeaths(selected_deaths_count + deaths_count)
        }
    }
    const addCountry = (result, new_dates, country) => {
        let file_data = result
        let new_cases_data = []
        let total_death_data = []

    
        file_data.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date)
        })
        for (let i = 0; i < file_data.length; i++) {
            file_data[i].date = new Date(file_data[i].date)
        }
        for (let i = 0; i < new_dates.length; i++) {
            let new_case_value, total_deaths_value;
            let current_date = new_dates[i]
            for (let f = 0; f < file_data.length; f++) {
                if (file_data[f]['date'].getTime() == current_date.getTime()) {
                    new_case_value = file_data[f]['new_cases']
                    total_deaths_value = file_data[f]['new_deaths']
                    // deaths_count = deaths_count + (parseInt(total_deaths_value) ? parseInt(total_deaths_value) : 0)
                    // cases_count = cases_count + (parseInt(new_case_value) ? parseInt(new_case_value) : 0)
                }
            }
            new_cases_data.push(new_case_value ? new_case_value : '')
            total_death_data.push(total_deaths_value ? total_deaths_value : '')

        }
        countTotals(file_data, country)
        let color =  getRandomColor()
        let cases = {
            name: country,
            data: new_cases_data,
            type: 'line',
            smooth: true,
            itemStyle: {
                borderWidth: 3,
                width: 2,
                color: colors[series.length]
            }
              
        }
        let death = {
            name: country,
            data: total_death_data,
            type: 'line',
            smooth: true,
            itemStyle: {
                borderWidth: 3,
                width: 2,
                color: colors[death_series.length]
            }
        }
        let add_case = [...series, cases]
        let add_death = [...death_series, death]
        setSeries(add_case)
        setDeathSeries(add_death)
    }

    return {
        fetchData
      }
}
export default chartData