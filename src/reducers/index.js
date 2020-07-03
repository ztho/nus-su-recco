import { combineReducers } from "redux"; 
import candidateDataReducer from "./candidateDataReducer"; 
import moduleListReducer from "./moduleListReducer";

export default combineReducers({
    candidateData: candidateDataReducer,  
    moduleList: moduleListReducer,
});