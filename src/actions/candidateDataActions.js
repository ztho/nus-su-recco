import { GET_CAND_DATA, UPDATE_CAND_DATA, CHANGE_CAND_MC, CHANGE_CAND_SU } from "./types";

export const getCandData = () => {
    return {
        type: GET_CAND_DATA
    }
}

export const updateCandData = (candidatureMC, remainingSU) => {
    return {
        type: UPDATE_CAND_DATA,
        payload: {candidatureMC,
                  remainingSU }
    }
}

export const changeCandMC = (candidatureMC) => {
    return {
        type: CHANGE_CAND_MC,
        payload: {candidatureMC}
    }
}

export const changeCandSU = (remainingSU) => {
    return {
        type: CHANGE_CAND_SU,
        payload: {remainingSU}
    }
}
