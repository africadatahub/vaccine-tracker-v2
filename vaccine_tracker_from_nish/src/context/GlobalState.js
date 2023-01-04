import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer';

const getDateArray = (start, end) => {
  var arr = new Array(), dt = new Date(start);
  while (dt <= end) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

// Initial state
const initialState = {
  countries: [],
  mapCountries: [],
  labels: getDateArray(new Date('2020-02-01T00:00:00'), new Date()),
  series: [],
  death_series: [],
  all_new_cases: [],
  selected_deaths_count:0,
  selected_cases_count: 0,
  template :'MORBIDITY_AND_MORTALITY_DATA',
  selected_countries: [],
  covax:0,
  bought:0,
  donated:0,
  covaxin:0,
  jj:0,
  moderna:0,
  ox_a:0,
  pfizer:0,
  sinopharm:0,
  sputnik:0,
  sputnik:0,
  sinovac:0,
  africa_total_deaths_count:0,
  regional_total_deaths_count:0,
  africa_total_cases_count:0,
  regional_total_cases_count:0
}

// Create context
export const GlobalContext = createContext(initialState);

// Provider component
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  // Actions
  function setRegionalCasesCount(countries) {
    dispatch({
      type: 'SET_COUNT_REGIONAL_CASES',
      payload: countries
    });
  }
  function setRegionalDeathCount(countries) {
    dispatch({
      type: 'SET_COUNT_REGIONAL_DEATHS',
      payload: countries
    });
  }
  function setAfricaCasesCount(countries) {
    dispatch({
      type: 'SET_COUNT_AFRICA_CASES',
      payload: countries
    });
  }
  function setAfricaDeathCount(countries) {
    dispatch({
      type: 'SET_COUNT_AFRICA_DEATHS',
      payload: countries
    });
  }

  function setCountCases(countries) {
    dispatch({
      type: 'SET_COUNT_CASES',
      payload: countries
    });
  }

  function setCountDeaths(countries) {
    dispatch({
      type: 'SET_COUNT_DEATHS',
      payload: countries
    });
  }

  function setCovaxin(countries) {
    dispatch({
      type: 'SET_COVAXIN',
      payload: countries
    });
  }

  function setSinovac(countries) {
    dispatch({
      type: 'SET_SINOVAC',
      payload: countries
    });
  }

  function setJJ(countries) {
    dispatch({
      type: 'SET_JJ',
      payload: countries
    });
  }

  function setModerna(countries) {
    dispatch({
      type: 'SET_MODERNA',
      payload: countries
    });
  }

  function setOx(countries) {
    dispatch({
      type: 'SET_OX',
      payload: countries
    });
  }

  function setPfizer(countries) {
    dispatch({
      type: 'SET_PFIZER',
      payload: countries
    });
  }

  function setSinopharm(countries) {
    dispatch({
      type: 'SET_SINOPHARM',
      payload: countries
    });
  }
  function setSputnik(countries) {
    dispatch({
      type: 'SET_SPUTNIK',
      payload: countries
    });
  }

  function setSelectedCountries(countries) {
    dispatch({
      type: 'SET_SELECTED_COUNTRIES',
      payload: countries
    });
  }
  function setDonated(countries) {
    dispatch({
      type: 'SET_DONATED',
      payload: countries
    });
  }
  function setCovax(countries) {
    dispatch({
      type: 'SET_COVAX',
      payload: countries
    });
  }
  function setBought(cases) {
    dispatch({
      type: 'SET_BOUGHT',
      payload: cases
    });
  }
  function setCountries(countries) {
    dispatch({
      type: 'SET_COUNTRIES',
      payload: countries
    });
  }
  function setMapCountries(countries) {
    dispatch({
      type: 'SET_MAP_COUNTRIES',
      payload: countries
    });
  }

  function setSeries(series) {
    dispatch({
      type: 'SET_SERIES',
      payload: series
    });
  }

  function setDeathSeries(series) {
    dispatch({
      type: 'SET_DEATH_SERIES',
      payload: series
    });
  }

  function setAllNewCases(cases) {
    dispatch({
      type: 'SET_ALL_NEW_CASES',
      payload: cases
    });
  }
  function setLabels(dates) {
    dispatch({
      type: 'SET_LABELS',
      payload: dates
    });
  }
  function setTemplate(template) {
    dispatch({
      type: 'SET_PAGE_TEMPLATE',
      payload: template
    });
  }

  // function getRandomColor() {
  //   var letters = '0123456789ABCDEF';
  //   var color = '#';
  //   for (var i = 0; i < 6; i++) {
  //     color += letters[Math.floor(Math.random() * 16)];
  //   }
  //   return color;
  // }

  function getRandomColor() {
    var colors = ["#C8E6F6","#F4BB8C","#9BDABA","#FFE79B","#B6B6B6","#D9F0D3","#F5A8A5","#D0D1E6","#74A9CF","#A38BC1"]
    var picked_colors = []


    for(let i=0; i<state.series.length; i++){
      let new_colors = []
      for(let d=0; d<colors.length; d++){
        if(colors[d] != state.series[i].itemStyle.color ){
          new_colors.push(colors[d])
        }
      }
      colors = new_colors
    }

    var color = colors[Math.floor(Math.random()*colors.length)];
    return color;
  }
  return (<GlobalContext.Provider value={{
    countries: state.countries,
    mapCountries: state.mapCountries,
    labels: state.labels,
    series: state.series,
    all_new_cases : state.all_new_cases,
    death_series: state.death_series,
    template: state.template,
    selected_countries: state.selected_countries,
    covax: state.covax,
    donated: state.donated,
    bought:state.bought,
    covaxin:state.covaxin,
    jj:state.jj,
    moderna:state.moderna,
    ox_a:state.ox_a,
    pfizer:state.pfizer,
    sinopharm:state.sinopharm,
    sputnik:state.sputnik,
    sinovac:state.sinovac,
    selected_deaths_count:state.selected_deaths_count,
    selected_cases_count: state.selected_cases_count,
    africa_total_deaths_count:state.africa_total_deaths_count,
    regional_total_deaths_count:state.regional_total_deaths_count,
    africa_total_cases_count:state.africa_total_cases_count,
    regional_total_cases_count:state.regional_total_cases_count,
    setCountCases,
    setCountDeaths,
    setSputnik,
    setCovaxin,
    setPfizer,
    setSinovac,
    setOx,
    setModerna,
    setJJ,
    setBought,
    setCovax,
    setSinopharm,
    setDonated,
    setCountries,
    setMapCountries,
    setSeries,
    getRandomColor,
    setAllNewCases,
    setLabels,
    setDeathSeries,
    setTemplate,
    setSelectedCountries,
    setAfricaDeathCount,
    setAfricaCasesCount,
    setRegionalDeathCount,
    setRegionalCasesCount
  }}>
    {children}
  </GlobalContext.Provider>);
}
