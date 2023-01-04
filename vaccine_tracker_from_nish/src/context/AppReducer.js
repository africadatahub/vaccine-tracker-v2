export default (state, action) => {
    switch (action.type) {
        case 'SET_COUNTRIES':
            
            return {
                ...state,
                countries: action.payload
            }
        case 'SET_MAP_COUNTRIES':
            
                return {
                    ...state,
                    mapCountries: action.payload
                }
        case 'SET_PAGE_TEMPLATE':
            
                return {
                    ...state,
                    template: action.payload
                }
        case 'SET_SERIES':
            
                return {
                    ...state,
                    series: action.payload
                }
        case 'SET_ALL_NEW_CASES':
            
                    return {
                        ...state,
                        all_new_cases: action.payload
                    }
        case 'SET_LABELS':
            
                    return {
                        ...state,
                        labels: action.payload
                    }
        case 'SET_DEATH_SERIES':
                return {
                        ...state,
                        death_series: action.payload
                    }
        case 'SET_COVAX':
                return {
                    ...state,
                    covax: action.payload
                }
        case 'SET_DONATED':
                return {
                    ...state,
                    donated: action.payload
                }
        case 'SET_BOUGHT':
            return {
                ...state,
                bought: action.payload
            }
        case 'SET_SELECTED_COUNTRIES':
            return {
                ...state,
                selected_countries: action.payload
            }
        case 'SET_SINOPHARM':
            return {
                ...state,
                sinopharm: action.payload
            }
        case 'SET_SPUTNIK':
            return {
                ...state,
                sputnik: action.payload
            }
        case 'SET_SINOVAC':
            return {
                ...state,
                sinovac: action.payload
            }
        case 'SET_PFIZER':
            return {
                ...state,
                pfizer: action.payload
            }
        case 'SET_OX':
            return {
                ...state,
                ox_a: action.payload
            }
        case 'SET_MODERNA':
            return {
                ...state,
                moderna: action.payload
            }
        case 'SET_JJ':
            return {
                ...state,
                jj: action.payload
            }
        case 'SET_COVAXIN':
            return {
                ...state,
                covaxin: action.payload
            }
        case 'SET_COUNT_DEATHS':
            return {
                ...state,
                selected_deaths_count: action.payload
            }
        case 'SET_COUNT_CASES':
            return {
                ...state,
                selected_cases_count: action.payload
            }
        case 'SET_COUNT_REGIONAL_CASES':
            return {
                ...state,
                regional_total_cases_count: action.payload
            }
        case 'SET_COUNT_REGIONAL_DEATHS':
            return {
                ...state,
                regional_total_deaths_count: action.payload
            }
        case 'SET_COUNT_AFRICA_CASES':
            return {
                ...state,
                africa_total_cases_count: action.payload
            }
        case 'SET_COUNT_AFRICA_DEATHS':
            return {
                ...state,
                africa_total_deaths_count: action.payload
            }
        default:
            return state;
    }
}