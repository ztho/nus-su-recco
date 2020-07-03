import { GET_MOD_LIST, DEL_MOD, UPDATE_MODULE_LIST, ADD_MODULE, UPDATE_SIM, DEL_SIM_CASE, REINSTATE_SIM_CASE, CLEAR_ALL } from "./types";
import Calculations from "../calculations/Calculations";
import DataFrame from "dataframe-js"

export const getModuleList= () => {
    return {
        type: GET_MOD_LIST
    }
}

export const deleteModule = (mod) => {
    return {
        type: DEL_MOD,
        payload: mod.moduleCode
    }
}

export const updateModuleList = (propName, i, newVal) => {
    if (propName === "su") {
        newVal = (newVal === "false")
    }
    return {
        type: UPDATE_MODULE_LIST, 
        payload: {propName, i, newVal}
    }
}

export const addModule = (newMod) => {
    return {
        type: ADD_MODULE,
        payload: newMod
    }
}

export const updateSim = (moduleList, candidatureMC, remainingSU, isSorted = true) => {
    const allSimResults = Calculations.getSimResults(moduleList, candidatureMC, remainingSU)
    return {
        type: UPDATE_SIM,
        payload: {simResults : allSimResults.combinedSim,
                  simCritVal : Calculations.getKeyNumbers(moduleList, candidatureMC, remainingSU, isSorted),
                  simKeyStats: allSimResults.combiStats}
    }
}

export const removeCase = (columnName, simResults, keyResults) => {
    var simResDF = new DataFrame(simResults, Object.keys(simResults))
    var keyResDF = new DataFrame(keyResults, Object.keys(keyResults))
    var deletedCombis = {
        combiSimRes: simResDF.select(columnName).toDict(),
        combiKeyRes: keyResDF.select(columnName).toDict()
    }

    simResDF = simResDF.drop(columnName).toDict()
    keyResDF = keyResDF.drop(columnName).toDict()
    return {
        type: DEL_SIM_CASE, 
        payload: {simResDF, keyResDF, deletedCombis}
    }
}

export const reinstateCase = (colName) => {
    return {
        type: REINSTATE_SIM_CASE, 
        payload: colName
    }
}

export const clearAll = () => {
    return {
        type: CLEAR_ALL 
    }
}


