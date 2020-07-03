import { Series, DataFrame } from 'pandas-js';

export default class Calculations { 
    static mapGradeToPoints = {
    "A+": 5,
    "A" : 5,
    "A-": 4.5,
    "B+": 4,
    "B" : 3.5,
    "B-": 3,
    "C+": 2.5,
    "C" : 2,
    "D+": 1.5,
    "D" : 1.0,
    "F" : 0 ,
    "CS": 0, 
    "S" : 0,
    "CU": 0, 
    "U" : 0
    }

    static genCombinations = function(list, min) {
        var fn = function(n, src, got, all) {
            if (n === 0) {
                if (got.length > 0) {
                    all[all.length] = got;
                }
                return ; 
            }
            for (var j = 0; j <src.length; j++) {
                fn(n - 1, src.slice(j + 1), got.concat([src[j]]), all);
            }
            return;
        }
        var all = [];
        for (var i = min; i < list.length; i++) {
            fn(i, list, [], all); 
        }
        all.push(list);
        return all; 
    }

    static getStats(moduleList){
        var cumGP = 0;
        var cumMC = 0;
        for (const mod of moduleList) {
            cumMC += parseInt(mod.moduleCredit); 
            cumGP += this.mapGradeToPoints[mod.grade] * mod.moduleCredit
        }
        var curCAP = cumGP/cumMC; 
        return {cumGP, cumMC, curCAP } 
    }

    static genReqPerf(moduleList, totalMC) {
        var avgGP = 2, totalGP = 0, simCAP = 0;
        var res = this.getStats(moduleList); 
        var simPerf = new DataFrame() 
        while (avgGP <= 5) {
            totalGP = avgGP * (parseInt(totalMC) - res.cumMC) + res.cumGP  
            simCAP = totalGP / parseInt(totalMC)
            simPerf.append({"AvgGP": avgGP, "simCAP": simCAP})
            avgGP += 0.01;
        }
        return simPerf.to_json(); 
    }

    static genSimResults(moduleList, totalMC){
        const suList = moduleList.filter(mod => (mod.su === true))
        /*var updateList = [...suList]
        console.log("Initial List")
        console.log(updateList)
        for (var i = 0; i <updateList.length; i++) {
            for (var j = i + 1; j < updateList.length; j++) {
                if (updateList[i].moduleCredit === updateList[j].moduleCredit && 
                    updateList[i].grade === updateList[j].grade) {
                        var cusMod = {
                            moduleCode: updateList[i].moduleCode.concat("/ ").concat(updateList[j].moduleCode),
                            moduleCredit: updateList[i].moduleCredit, 
                            grade: updateList[i].grade,
                            su: false
                        } 
                        updateList.splice(i,j)
                        updateList.push(cusMod);
                    }
            }
        }
        console.log("Final List");
        console.log(updateList);*/

        //generate results for each scenario 
        const combis = this.genCombinations(suList, 1)
        
        //generate simulation results (to fix)
        var combinedSim = {}
        combinedSim["No SU"] = this.genReqPerf(moduleList, 160); //baseline, no SU
        if (suList.length === 0) {
            return combinedSim;
        }
        for (var combi of combis) {
            var mods = combi.map(mod => mod.moduleCode);
            var resultingModList = moduleList.filter(mod => !(mods.includes(mod.moduleCode)));
            combinedSim["SU ".concat(mods.join(", "))] = this.genReqPerf(resultingModList, 160);
        }
        //console.log(combinedSim);
        return combinedSim;
    }

    static getKeyNumbers(moduleList) {
        var combinedSim = this.genSimResults(moduleList)
        //Function returns an array of objects with key values 
        var keys = Object.keys(combinedSim); 
        var out = {}
        var cutOff = []
        //populate cutOff
        for (var i = 1; i <= 5; i += 0.5) {
            cutOff.push(i);
        }
        console.log(keys)
        //console.log(cutOff);
        for (var key of keys) {
            out[key] = {}
            var simResults = combinedSim[key]
            //console.log(simResults);
            for (var critVal of cutOff) {
                if (critVal > simResults[simResults.length - 1].simCAP) {
                    break;
                }
                 //loop through simulated results
                i = 0;
                while (i < simResults.length) {
                    if (simResults[i].simCAP - critVal < 0.00000000001){
                        out[key][Math.round(critVal * 100)/100] = parseFloat(Math.round(simResults[i].avgGP * 100)/100) 
                    }
                    i += 1;
                }
            }
        }
        return out;
    }
}