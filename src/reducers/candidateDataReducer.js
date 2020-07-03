import { GET_CAND_DATA, UPDATE_CAND_DATA, CHANGE_CAND_MC, CHANGE_CAND_SU} from "../actions/types";

const initialState = {
    candidatureMC: -1, //amount of MCs taken
    remainingSU: 0, 
}

export default function(state = initialState, action) {
    switch(action.type) {
        //it's an object
        case GET_CAND_DATA:
            return {
                ...state
            }

        case UPDATE_CAND_DATA:
            return {
                ...state, 
                ...action.payload.candidatureMC,
                ...action.payload.remainingSU 
            }
        case CHANGE_CAND_MC:
            return {
                ...state,
                candidatureMC: action.payload.candidatureMC 
            }

        case CHANGE_CAND_SU:
            return {
                ...state,
                remainingSU: action.payload.remainingSU
            }
        /*case CLEAR_ALL: 
            return {
                ...state,
                candidatureMC: "",
                remainingSU: "",
            }*/
            
        default:
            return {
                ...state
            }
    }
}