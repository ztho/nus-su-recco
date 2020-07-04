import React, { Component } from 'react'
import { Card, 
         CardHeader,
         CardContent,
         Modal, 
         Backdrop, 
         Fade, 
         Table,
         TableContainer,
         TableBody, 
         TableHead, 
         TableRow, 
         TableCell,
         Typography,
         Tooltip} from "@material-ui/core";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/styles';
import DataFrame from "dataframe-js";
import {connect} from "react-redux"
import gradient from 'gradient-color'

const colorGrad = gradient(['#cb2431', "#fb8532", '#34d058'], 301)
const useStyles = {
    modal: {
        top: "50%",
        margin: "auto",
        display:'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        outline: 0,
    }, 
    cardContainer: {
        outline: 0,
        padding: 5,
    },
    cardContent: {
        padding: 1,
    },
    tableHeader: {
        fontSize: 14,
        fontWeight: "bold",
        textAlign:"center"
    },
    dataDefault: {
        textAlign: "center",
        variant : "h6"
    },
    dataBetterThanBase: {
        //When the required performance is lower than the baseline, colour green 
        textAlign: "center",
        variant : "h6",
        color: "#28a745"
    },
    dataWorsethanBase: {
        textAlign: "center",
        variant : "h6",
        color: "#cb2431"
    }
}

const renderRow = (row, classes, idx) => {
    let styleClass = classes.dataDefault
    let baseColorStyle = null
    let baseCap = Object.values(row)[1]
    if (baseCap === null) baseCap = "Not Attainable"
    return (
        <TableRow key={`Modalrow + ${idx}`}>
            {Object.values(row).map((data, colNum) => {
                baseColorStyle = null
                if (data === null) data = "Not Attainable"
                if (colNum === 0) {
                    baseColorStyle = {color: colorGrad[idx]}
                    styleClass = classes.dataDefault
                }
                if ((Math.round(data *1000)/1000  < Math.round(baseCap*1000)/1000 && colNum !== 0) || 
                    (baseCap === "Not Attainable" && data !== "Not Attainable" && colNum > 1)
                ) styleClass = classes.dataBetterThanBase
                if ((Math.round(data * 1000)/1000 > Math.round(baseCap * 1000) /1000 && colNum !==0) && 
                baseCap !== "Not Possible" && data > 0) styleClass = classes.dataWorsethanBase

                return (
                    <TableCell key ={data * colNum} className = {styleClass} style={baseColorStyle}>
                        <Typography className = {styleClass}>
                            {data !== "Not Attainable" ? 
                            data > 0 ? 
                            colNum === 0 ? 
                            (Math.round(data *100)/100).toFixed(2) :
                            (Math.round(data * 1000)/1000).toFixed(3) : 
                            "Not Possible" :
                            data}
                        </Typography>
                    </TableCell>
                )
            })}
        </TableRow>
    )
}

const renderSimResults = (simResultsDF, classes) => {
    const simResultsArr = simResultsDF.toCollection()
    return simResultsArr.map((row, idx) =>(
        renderRow(row, classes, idx)
    ))
}

export class ResultsTableModal extends Component {
    state = {
        modal: false
    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal 
        })
    }
    render() {
        const {classes} = this.props
        var {simResults} = this.props.moduleList
        var simResultsDF = new DataFrame(simResults, Object.keys(simResults))
        return (
            <div>
            <Tooltip 
                title = "See Detailed Results" 
                placement = "right-start" 
                arrow 
                TransitionComponent={Fade} 
                TransitionProps={{ timeout: 500 }}>
                <IconButton onClick ={() => this.toggle()}> <OpenInNewIcon/> </IconButton>
            </Tooltip>
            <Modal 
                open = {this.state.modal}
                onClose ={this.toggle}
                closeAfterTransition
                className = {classes.modal}
                BackdropComponent ={Backdrop}
                BackdropProps ={
                    {timeout: 500}
                }
                >
                <Fade in={this.state.modal}>
                    <Card className ={classes.cardContainer}>
                        <CardHeader title= "Required Results Breakdown" />
                            <CardContent className = {classes.cardContent}>
                                <TableContainer style={{maxHeight: 500}}>  
                                <Table stickyHeader size ="small">
                                    <TableHead className = {classes.tableHeader}>
                                        <TableRow>
                                            <TableCell className = {classes.rowTopHeader}></TableCell>
                                                <TableCell 
                                                    key="topHeader" 
                                                    align ="center"
                                                    className = {classes.rowTopHeader} 
                                                    colSpan={simResultsDF.listColumns().length - 1}>
                                                        <Typography style={{fontWeight: "bold"}}>
                                                        Required Average Performance To Achieve Target Graduation Cap 
                                                        </Typography> 
                                                </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            {simResultsDF.listColumns().map((head, i) => 
                                            <TableCell key = {`thc-${head}`} className = {classes.tableHeader}>
                                                <Typography className = {classes.tableHeader}> {head === "gradCap" ? "Target Graduation CAP" : head}
                                                </Typography>
                                            </TableCell>)}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderSimResults(simResultsDF, classes)}
                                    </TableBody>
                                </Table>
                                </TableContainer>  
                            </CardContent>
                    </Card>
                </Fade>
            </Modal>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,
    candidateData: state.candidateData
})

export default connect(mapStateToProps)(withStyles(useStyles)(ResultsTableModal))