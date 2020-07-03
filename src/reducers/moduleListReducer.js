import { GET_MOD_LIST, 
        DEL_MOD, 
        UPDATE_MODULE_LIST, 
        ADD_MODULE, 
        UPDATE_SIM, 
        DEL_SIM_CASE, 
        REINSTATE_SIM_CASE,
        CLEAR_ALL} from "../actions/types";
import DataFrame from "dataframe-js";

const initialState = {
    moduleList: [],
    simResults : [],
    simCritVal : [],
    deletedCombisSimRes: [],    
    deletedCombisKeyRes: [],
    simKeyStats: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_MOD_LIST :
            return {
                ...state,
            }

        case DEL_MOD:
            return {
                ...state,
                moduleList: state.moduleList.filter(mod => mod.moduleCode !== action.payload)
            }
        case UPDATE_MODULE_LIST:
            return {
                ...state, 
                moduleList: state.moduleList.map((mod, j) => j === action.payload.i ?
                {...mod, [action.payload.propName]: action.payload.newVal }: mod ),
                
            }
        case ADD_MODULE:
            return {
                ...state,
                moduleList: [...state.moduleList, action.payload],
            }

        case UPDATE_SIM:
            return {
                ...state,
                simResults: action.payload.simResults, 
                simCritVal: action.payload.simCritVal,
                deletedCombisSimRes: [],
                deletedCombisKeyRes: [],
                simKeyStats: action.payload.simKeyStats,
            }
        
        case DEL_SIM_CASE:
            return {
                ...state,
                simResults: action.payload.simResDF, 
                simCritVal: action.payload.keyResDF, 
                deletedCombisSimRes: [...state.deletedCombisSimRes, action.payload.deletedCombis.combiSimRes],
                deletedCombisKeyRes: [...state.deletedCombisKeyRes, action.payload.deletedCombis.combiKeyRes]
            }

        case REINSTATE_SIM_CASE:
            var targetAdd = Object.values(state.deletedCombisSimRes.find(set => {return Object.keys(set)[0] === action.payload[0]})).flat()
            var newSimResults = new DataFrame(state.simResults, Object.keys(state.simResults))
            newSimResults = newSimResults.withColumn(action.payload[0], (row, i) => targetAdd[i])

            targetAdd = Object.values(state.deletedCombisKeyRes.find(set => {return Object.keys(set)[0] === action.payload[0]})).flat()
            var newKeyResults = new DataFrame(state.simCritVal, Object.keys(state.simCritVal))
            newKeyResults = newKeyResults.withColumn(action.payload[0], (row, i) => targetAdd[i])
            return {
                ...state, 
                simResults: newSimResults.toDict(), 
                simCritVal: newKeyResults.toDict(), 
                deletedCombisSimRes: state.deletedCombisSimRes.filter(i => Object.keys(i)[0] !== action.payload[0]),
                deletedCombisKeyRes: state.deletedCombisKeyRes.filter(i => Object.keys(i)[0] !== action.payload[0])
            }
        case CLEAR_ALL:
            return {
                ...state,
                moduleList: [], 
                simResults : [],
                simCritVal : [],
                deletedCombisSimRes: [],    
                deletedCombisKeyRes: [],
                simKeyStats: []
            }
        default:
            return {
                ...state
            }
    }
}