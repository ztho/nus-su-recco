import React, { Component } from 'react'
import { Table,
    TableContainer,
    TableBody, 
    TableHead, 
    TableRow, 
    TableCell,
    Card, 
    CardHeader, 
    CardContent,
    CardActions,
    Divider,
    Chip,
    Typography,
    Tooltip,
    IconButton,
    Fade} from "@material-ui/core"
import ClearIcon from '@material-ui/icons/Clear';
import DoneIcon from '@material-ui/icons/Done';
import DownloadSimResultsButton from "./CustomizedButtons/DownloadSimResultsButton"
import ResultsTableModal from "./ResultsTableModal"
import Calculations from "../calculations/Calculations"
import DataFrame from "dataframe-js";
import {connect} from "react-redux"
import { withStyles } from '@material-ui/styles';
import {getModuleList, removeCase, reinstateCase, updateSim} from "../actions/moduleListActions"

const useStyles = theme => ({
    tableHeader: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign:"center"
    },
    rowTopHeader: {
        fontSize: 14,
        fontWeight: "bold",
        borderBottom: "none",
    },
    rowTopHeaderMarked: {
        borderBottom: "none",
        borderRightWidth: 1,
        borderWidth: 0,
        borderColor: 'black',
        borderStyle: 'solid',
    },
    rowMidHeader: {
        fontSize: 14,
        fontWeight: "bold",
        backgroundColor: "#FAFAFA"
    }, 
    dataDefault: {
        textAlign: "center",
        variant : "h6"
    },
    dataDefaultInner: {
        textAlign: "center",
        variant: "h6"
    },
    keyStatsHead: {
        textAlign: "left",
        color: "#28a745",
    },
    keyStatsHeadSub: {
        textAlign: "left",
        color: "#6a737d",
    }, 
    keyStatsSubData: {
        textAlign: "center", 
        color: "#6a737d",
    },
    highlightGreen: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#28a745"
    },
    highlightRed: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#9e1c23"
    },
    highlightBlue: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#05264c"
    },
    indexColumn: {
        fontWeight: "bold"
    }, 
    cardHeader: {
        fontSize: 12
    },
    cardContent: {
        padding: 0 
    },
    cardContainer: {
        border: '1px solid',
        borderColor: '#E7EDF3',
        borderRadius: 4,
        transition: '0.4s',
        '&:hover': { 
            borderColor: "#5B9FED"
        } 
    },
    cardFooter: {
        border: 1
    },
    bottomActions: {
        justifyContent: 'flex-end',
        height: 50
    },
    chips: {
        colorPrimary: "#5B9FED",
        '&:hover': { 
            colorPrimary: "#5B9FED"
        } 
    }
})

const addHeader = (simCritValDF, classes, i) => (
    <TableRow key={`headerRow + ${i}`} className = {classes.rowMidHeader}>
        <TableCell 
            key="midHeader" 
            className = {classes.rowMidHeader} 
            colSpan={simCritValDF.listColumns().length}>
                <Typography style={{fontWeight: "bold"}}>Key Statistics</Typography>
        </TableCell>
    </TableRow>
)

const renderRow = (row, classes, critCap = 999, rowNum = 0) => (
    <TableRow key={`row + ${rowNum}`}>
    {Object.values(row).map((d, colNum) => {
        var styleClass = classes.dataDefault
        if (rowNum >= 7){
            if (colNum === 0) {
                //if it's the key stats headers
                styleClass = classes.keyStatsHead
            }
            if (rowNum === 7 && colNum !== 0) {
                if (d < critCap) {
                    styleClass = classes.highlightRed
                } else if (d === critCap) {
                    styleClass = classes.highlightBlue
                } else {
                    styleClass = classes.highlightGreen
                }
            }
            if (rowNum > 7 && colNum === 0) {
                styleClass = classes.keyStatsHeadSub
            }
            if (rowNum > 7 && colNum !== 0) {
                styleClass = classes.keyStatsSubData
            }
        }
        return (<TableCell key ={d + colNum} className = {styleClass}>
                    <Typography className ={styleClass}>
                         {d}
                    </Typography>
                </TableCell>)
    })}
    </TableRow>
)

const renderKeyVals = (simCritValDF, classes, critCap) => {
    const simCritValArr = simCritValDF.toCollection() 
    var i = 0 
    var output = []
    while (i < simCritValArr.length) {
        output.push(renderRow(simCritValArr[i], classes, critCap, i))
         if (i === 6) output.push(addHeader(simCritValDF, classes, i))
         i += 1
    }
    return output
}

class ResultsTable extends Component {
    state = {
        moduleList: [], 
        dataDF: new DataFrame([],[]),
        isSorted: false, 
    }
    removeCase = (columnName, simResults, simCritVal) => {
        this.props.removeCase(columnName, simResults, simCritVal)
    }

    renderDeleteted = (colName, className) => (
        <Chip
        label={colName}
        clickable
        color="primary"
        onClick={() => this.reinstateDeleted(colName)}
        onDelete={() => this.reinstateDeleted(colName)}
        deleteIcon={<DoneIcon />}
        variant="outlined"
        className = {className}
        />
    )

    reinstateDeleted = (colName) => {
        this.props.reinstateCase(colName)
    }
    
    render() {
        const {classes} = this.props
        var {moduleList, simResults, simCritVal, deletedCombisSimRes} = this.props.moduleList
        const {candidatureMC} = this.props.candidateData
        var simCritValDF = new DataFrame(simCritVal, Object.keys(simCritVal))
        var critCap = Calculations.getStats(moduleList).curCAP[0]
        
        /*if (Object.keys(simCritVal).length !== 1) {
            critCap = simCritValDF.find(row => row.get("gradCap") === "Immediate CAP").select("No SU").get("No SU")
        }*/
        return (
            <Card className ={classes.cardContainer}> 
                <CardHeader title = "Simulated Required Results" 
                            className = {classes.cardHeader} 
                            titleTypographyProps={{variant:'h6'}}
                            />
                <Divider />
                {candidatureMC === -1 || simResults.length === 0 ? null :
                <Fade in={true} timeout={500}>
                <CardContent className = {classes.cardContent}>  
                    <TableContainer>
                    <Table stickyHeader size ="small">
                        <TableHead className = {classes.tableHeader}>
                            <TableRow>
                                <TableCell className = {classes.rowTopHeader}></TableCell>
                                    <TableCell 
                                        key="topHeader" 
                                        align ="center"
                                        className = {classes.rowTopHeader} 
                                        colSpan={simCritValDF.listColumns().length - 1}>
                                            <Typography style={{fontWeight: "bold"}}>
                                            Required Average Performance To Achieve Target Graduation Cap 
                                            </Typography> 
                                    </TableCell>
                            </TableRow>
                            <TableRow>
                                {simCritValDF.listColumns().map((head, i) => 
                                <TableCell key = {`thc-${head}`} className = {classes.tableHeader}>
                                    <Typography className = {classes.tableHeader}> {head === "gradCap" ? "Target Graduation CAP" : head}
                                    {head === "gradCap" || head === "No SU" ? null : 
                                        <Tooltip 
                                        title = "Hide Combination" 
                                        placement = "bottom" 
                                        arrow 
                                        TransitionComponent={Fade} 
                                        TransitionProps={{ timeout: 500 }}>
                                        <IconButton onClick = {() => this.removeCase(head, simResults, simCritVal)}>
                                            <ClearIcon />
                                        </IconButton>
                                        </Tooltip> }
                                    </Typography>
                                </TableCell>)}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderKeyVals(simCritValDF, classes, critCap)}
                        </TableBody>
                    </Table>
                    </TableContainer>  
                </CardContent>
                </Fade>}
                {candidatureMC === -1 || deletedCombisSimRes.length === 0 ? null :
                <CardContent className ={classes.cardFooter}>
                    {deletedCombisSimRes.length === 0 ? null :
                    <Fade in={true} timeout={500}>
                        <Typography> 
                            Removed Combinations: {deletedCombisSimRes.map(set => this.renderDeleteted(Object.keys(set), classes.chips))}
                        </Typography>
                    </Fade>}
                </CardContent>}
                {candidatureMC === -1 || simResults.length === 0 ? null :
                <CardActions className ={classes.bottomActions}>
                    <DownloadSimResultsButton />
                    <ResultsTableModal />
                </CardActions>}
                </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,
    candidateData: state.candidateData
})
  
export default connect(mapStateToProps, {getModuleList, removeCase, reinstateCase, updateSim})(withStyles(useStyles)(ResultsTable))
