import axios from "axios"; 

const getModules = () => {
    return axios.get("https://api.nusmods.com/v2/2019-2020/moduleInfo.json")
                .then(res => {
                    return res.data
                      })
                .catch(err => {console.log(err)})
}

const processList = (moduleList) => {
    let processedList = []
    moduleList.map(mod => 
        processedList.push({
            moduleCode: mod.moduleCode,
            moduleTitle: mod.title,
            moduleCredit: mod.moduleCredit
        }))
    return processedList
}

export const MasterModuleList = getModules().then(data => processList(data))