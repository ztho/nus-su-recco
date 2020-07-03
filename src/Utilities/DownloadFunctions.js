import FileSaver from "file-saver"

export const downloadModuleList = (moduleListDF) => {
    const moduleListCSV = moduleListDF.toCSV(true) 
    const exportData = new Blob([moduleListCSV], { type: 'text/csv;charset=utf-8;' })

    FileSaver.saveAs(exportData, "module-list.csv")

    /*const moduleListJSON = moduleListDF.toJSON(true)
    const exportData2 = new Blob([moduleListJSON],{type: "application/json"})
    FileSaver.saveAs(exportData2, "module-list.json")*/
}

export const downloadSimResults = (simResultsDF) => {
    const simReultsCSV = simResultsDF.toCSV(true) 
    const exportData = new Blob([simReultsCSV], { type: 'text/csv;charset=utf-8;' })
    FileSaver.saveAs(exportData, "simulation-results.csv")
}
