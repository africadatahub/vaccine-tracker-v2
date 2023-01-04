import React, { useState,useContext } from 'react'
import { GlobalContext } from '../context/GlobalState'

export default function FilterByYear() {
    const [filtered, setFilter] = useState('all')
    const {all_new_cases, labels, setLabels, setSeries,setDeathSeries, getRandomColor, setAfricaDeathCount,setAfricaCasesCount,
        selected_cases_count,selected_deaths_count,setCountCases,setCountDeaths,
        setRegionalDeathCount,setRegionalCasesCount,regional_total_deaths_count,regional_total_cases_count} = useContext(GlobalContext)
    const regions =   ['West Africa','North Africa', 'Southern Africa', 'Central Africa', 'East Africa']
    const africa = 'Africa'
    const colors = ["#C8E6F6","#F4BB8C","#9BDABA","#FFE79B","#B6B6B6","#D9F0D3","#F5A8A5","#D0D1E6","#74A9CF","#A38BC1"]

    const getDateArray = (start, end) => {
        var arr = new Array(), dt = new Date(start);
        while (dt <= end) {
          arr.push(new Date(dt));
          dt.setDate(dt.getDate() + 1);
        }
        return arr;
      }


    const removeMonths = (months) => {
        let date = new Date()
        date.setMonth(date.getMonth() - months);
        date.setMilliseconds(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setHours(0)
        return new Date(date);
      }

    const findFirst = (file_data,count_type) =>{
        for(let i=0; i<file_data.length; i++){
            let deaths_count = file_data[i][count_type]
            if(deaths_count){
                return deaths_count
            }
            else{
                deaths_count = 0
            }
        }
        return 0
    }
    const findLast = (file_data,count_type) =>{
        for(let i=file_data.length-1; i>=0; i++){
            let count = file_data[i][count_type]
            if(count){
                return count
            }
            else{
                count = 0
            }
        }
        return 0
    }
    const countTotals = (file_data, country)=>{
        let count = 1
        let first_death = findFirst(file_data,'total_deaths')
        let last_death = findLast(file_data,'total_deaths')
        let first_cases = findFirst(file_data,'total_cases')
        let last_cases = findLast(file_data,'total_cases')
        let cases_count = last_cases -first_cases
        let deaths_count = last_death-first_death

        let last = file_data[file_data.length -1]['total_deaths']
        if(country == africa){
            setAfricaDeathCount(deaths_count)
            setAfricaCasesCount(cases_count)
        }
        else if(regions.includes(country)){
            setRegionalDeathCount( deaths_count)
            setRegionalCasesCount(cases_count )
        }
        else{
            setCountCases(cases_count )
            setCountDeaths(deaths_count)
        }
    }
    const months = (month) => {
        var d = removeMonths(month)
        var new_series = []
        var death = []
        
        
        if(month > 12){
            const new_dates = getDateArray(new Date('2020-02-01T00:00:00'), new Date())
            setLabels(new_dates)
            for(let i =0; i<all_new_cases.length; i++){
                let arr = addCountry(all_new_cases[i].result, new_dates,all_new_cases[i].country,colors[i] )
                new_series.push( arr[0] )
                death.push( arr[1] )
            }
        }
        else{
            const new_dates = getDateArray(new Date(d), new Date())
            setLabels(new_dates)
            for(let i =0; i<all_new_cases.length; i++){
                let arr = addCountry(all_new_cases[i].result, new_dates ,all_new_cases[i].country,colors[i] )
                new_series.push( arr[0] )
                death.push( arr[1] )
            }
        }

        setSeries(new_series)
        setDeathSeries(death)
    }

    const addCountry = (result, new_dates, country,color) => {
        let file_data = result
        let new_cases_data = []
        let total_death_data = []
        let new_file_data = []
    
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
                    new_file_data.push(file_data[f])
                }
            }
            new_cases_data.push(new_case_value ? new_case_value : '')
            total_death_data.push(total_deaths_value ? total_deaths_value : '')
            

        }
        countTotals(new_file_data, country)
        //let color =  getRandomColor()
        let cases = {
            name: country,
            data: new_cases_data,
            type: 'line',
            smooth: true,
            itemStyle: {
                borderWidth: 3,
                width: 2,
                color: color
            },
        }
        let death = {
            name: country,
            data: total_death_data,
            type: 'line',
            smooth: true,
            itemStyle: {
                borderWidth: 3,
                width: 2,
                color: color
            },
        }
        return [cases, death]
    }

    const six_months = ()=>{
        months(6)
        setFilter('six_months')
    }
    const last_year = ()=>{
        months(12)
        setFilter('last_year')
    }
    const all = ()=>{
        months(13)
        setFilter('all')
    }
    return (
        <div className='filter-button--container d-flex justify-content-end w-100'>


            <button className={filtered == 'six_months' ? 'filter-button active':'filter-button'}  value='' onClick={() => six_months() }>Last 6 Months</button>
            <button className={filtered == 'last_year' ? 'filter-button active':'filter-button'}  value='' onClick={() => last_year()}>In the Last Year</button>
            <button className={filtered == 'all' ? 'filter-button active':'filter-button'} value='' onClick={() => all()}>All</button>
        </div>
    )
}
