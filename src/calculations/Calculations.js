import DataFrame from "dataframe-js";

export default class Calculations {
    static mapGradeToPoints = new DataFrame ([
        {grade: "A+", points: 5.0},
        {grade: "A", points: 5.0},
        {grade: "A-", points: 4.5},
        {grade: "B+", points: 4.0},
        {grade: "B", points: 3.5},
        {grade: "B-", points: 3.0},
        {grade: "C+", points: 2.5},
        {grade: "C", points: 2.0},
        {grade: "D+", points: 1.5},
        {grade: "D", points: 1.0},
        {grade: "F", points: 0},
        {grade: "CS", points: 0},
        {grade: "CU", points: 0},
        {grade: "S", points: 0},
        {grade: "U", points: 0},
    ], ["grade", "points"])

    static nonCountedGrades = ["CS", "CU", "S", "U"]

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

    /**
     * Returns current CAP, cumulative GP and cumulative MC (Without CS/CU/S/U modules) and cumulative non graded MCs (NGMCs)
     */
    static getStats(moduleList){
        const ml = new DataFrame(moduleList, ["moduleCode", "moduleTitle", "moduleCredit", "grade", "su"]); 
        var cumGP = 0;
        var cumMC = 0;
        var cumNGMC = 0;
        for (const [modCode, modTitle, modCre, grade, su] of ml) {
            if (!(this.nonCountedGrades.indexOf(grade) >= 0)){
                cumMC += parseInt(modCre)
                cumGP += (this.mapGradeToPoints.find({"grade": grade}).get("points")) * modCre
            } else {
                cumNGMC += modCre
            }
        }
        var curCAP = cumGP/cumMC; 
        curCAP = (Math.round(curCAP * 100) / 100)
        if (cumMC === 0) curCAP = 0
        curCAP = curCAP.toFixed(2)
        return new DataFrame([{cumGP, cumMC, curCAP, cumNGMC}], ["cumGP", "cumMC", "curCAP", "cumNGMC"]).toDict()
    }

    /**
     * Returns a Dictionary {gradCap, reqAvgPerf}
     * accepts 2 required params: moduleList, and the number of MCs the user needs to take throughout candidature
     * accepts optional parameter withGradCap. If set to true, will return dictionary
     * with the gradCap required
     */
    static getReqPerf(moduleList, totalMC = 160, remainingSUs = 0, withGradCap = false) {
        var gradCap = 1, reqAvgPerf, totalReqGradGP, totalGradedMCs
        var res = this.getStats(moduleList); 
        totalGradedMCs = totalMC - res.cumNGMC[0] - remainingSUs
        var reqRes
        if (withGradCap) {
            reqRes = new DataFrame([], ["gradCap", "reqAvgPerf"])
        } else {
            reqRes = new DataFrame([], ["reqAvgPerf"])
        }
        while (gradCap <= 5) {
            var totalCurGP = res.cumGP[0]; //find current amount of Grade Points
            totalReqGradGP = gradCap * (totalGradedMCs) //calculate the total amount of GP req to grad at that cap 
            var totalReqGP = totalReqGradGP - totalCurGP //Calculate the total amount of GP to achieve with remaining mods
            reqAvgPerf = totalReqGP / (totalMC - res.cumMC[0] - res.cumNGMC[0] - remainingSUs)
            //if unattainable
            if (reqAvgPerf > 5) {
                reqAvgPerf = null;
            } 

            var newRow
            if (withGradCap) {
                newRow = {gradCap: gradCap, reqAvgPerf: reqAvgPerf}
            } else {
                newRow = {reqAvgPerf: reqAvgPerf}
            }
            reqRes = reqRes.push(newRow)
            gradCap += 0.01
        }
        return reqRes.toDict()
    }

    /**
     * Takes in a list of modules (noting which modules are considering SU), the candidature MCs and remaining SUs 
     * and generates the result curve for each case of SUs
     * Calculation assumes all remainingSUs are utilized
     */ 
    static getSimResults(moduleList, totalMC = 160, remainingSUs = 0) {
        //get mods which are to be SU-ed
        const suList = moduleList.filter(mod => (mod.su === true));

        //generate results for each scenario 
        const combis = this.genCombinations(suList, 1)
         
        //Stores the simulation results from getReqPerf in column
        var combinedSim = {}
        var combiStats = new DataFrame([],["suCombi","newCap", "maxCap", "diff"])
        
        combinedSim["gradCap"] = this.getReqPerf(moduleList, totalMC, remainingSUs, true).gradCap
        combinedSim["No SU"] = Object.values(this.getReqPerf(moduleList, totalMC, remainingSUs)).flat() //only
        combiStats = combiStats.push(["No SU", this.getStats(moduleList).curCAP[0], this.getMaxCap(moduleList, totalMC, remainingSUs), this.getDiff(moduleList, totalMC, remainingSUs)])

        //if no SUs, then just return the pure case
        if (suList.length === 0) {
            combiStats = combiStats.toDict()
            return {combinedSim, combiStats};
        }

        for (var combi of combis) {
            let mods = combi.map(mod => mod.moduleCode); 
            var resultingModList = moduleList.filter(mod => !(mods.includes(mod.moduleCode)));
            //var resultingCumMC = this.getStats(resultingModList).cumMC[0]
            combinedSim["SU ".concat(mods.join(", "))] = Object.values(this.getReqPerf(resultingModList, 160)).flat();
            combiStats = combiStats.push(["SU ".concat(mods.join(", ")), 
                                           this.getStats(resultingModList).curCAP[0],
                                           this.getMaxCap(resultingModList, totalMC, remainingSUs), 
                                           this.getDiff(resultingModList, totalMC, remainingSUs)])
        }

        combiStats = combiStats.toDict()
        return {combinedSim, combiStats};
    }

    /**
     * Takes in a list of modules, the candidature MCs and remaining SUs 
     * to calculate the gradient (sensitivity) of curve
     * Calculation assumes all remainingSUs are utilized
     */  
    static getDiff(moduleList, totalMC, remainingSUs) {
        var curStats = this.getStats(moduleList)
        var diff =  (1 - (curStats.cumMC[0] / (totalMC - remainingSUs - curStats.cumNGMC[0])))/2
        diff = (Math.round(diff * 1000)/1000).toFixed(3)
        if (isNaN(diff)) diff = ""
        return diff
    }

    /**
     * Takes in a list of modules, the candidature MCs and remaining SUs 
     * to calculate the maximum attainable CAP. 
     * Calculation assumes all remainingSUs are utilized
     */
    static getMaxCap(moduleList, totalMC, remainingSUs) {
        const curStats = this.getStats(moduleList)
        const totalCurGP = curStats.cumGP[0]; //find current amount of Grade Points
        const totalCurMC = curStats.cumMC[0]; //find current amount of MCs 
        const totalRemainingMCs = totalMC - curStats.cumMC[0] - curStats.cumNGMC[0] - remainingSUs
        var maxCap = (5 * totalRemainingMCs +  totalCurGP) / (totalRemainingMCs + totalCurMC)
        maxCap = (Math.round(maxCap * 100)/100).toFixed(2)
        if (isNaN(maxCap)) maxCap = ""
        return maxCap
    }

    /**
     * Filters the simulation results to extract the required average performance 
     * at each grade level (first class, second upper, etc)
     */ 
    static getKeyNumbers(combinedSim, totalMC = 160, remainingSUs = 0, sortByDiff = false) {
        const combinedSimRes = this.getSimResults(combinedSim, totalMC, remainingSUs)
        combinedSim = combinedSimRes.combinedSim 
        var simKeyStats = combinedSimRes.combiStats
        simKeyStats = new DataFrame(simKeyStats, Object.keys(simKeyStats)) //convert to dataframe 
        
        if (sortByDiff) {
            simKeyStats = simKeyStats.sortBy(["newCap", "diff", "maxCap"])
            combinedSim = new DataFrame(combinedSim, Object.keys(combinedSim))                       
            //combinedSim.show()    
            combinedSim = combinedSim.restructure(["gradCap",...simKeyStats.select("suCombi").toArray()]).toDict() 
        }
        //restructure data for subsequent addition
        simKeyStats = simKeyStats.transpose()
                                 .slice(1, ) //remove headers
                                 .toArray() //convert to array to push later                   
        var columns = [...Object.keys(combinedSim).map(head => head)].flat()
        var output = new DataFrame([], columns)
        var cutOff = []
        combinedSim = new DataFrame(combinedSim, columns) //convert to dataFrame

        for (var cut = 2.0; cut <= 5; cut += 0.5) {
            cutOff.push((Math.round(cut * 10)/10).toFixed(1))
            cut += 0.5
        }

        for (let cut of cutOff) {
            let res = combinedSim.find(row => {
                return row.get("gradCap") - cut > -0.00000000001 && cut - row.get("gradCap") < 0.0000000001
            })
            //var res = combinedSim.find({"gradCap": cut}
            let procRes = Object.values(res.toDict())
            procRes = procRes.map((v, i) =>  v !== null ? 
                                    i === 0 ?  
                                    (Math.round(v * 100)/100).toFixed(1) : 
                                    v > 0 ?
                                    (Math.round(v * 100)/100).toFixed(2) : "Not Possible" : "Not Attainable")
            output = output.push(procRes)
        }

        //add keyStats 
        const headers = ["Immediate CAP", "Max Attainable CAP", "Sensitivity"]
        simKeyStats = simKeyStats.map((row, i) => [headers[i], ...row])
        output = output.push(...simKeyStats)
        return output.toDict()
    }
}