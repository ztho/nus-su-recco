import React, { Component } from 'react'
import {getModuleList} from "../actions/moduleListActions"
import {connect} from "react-redux"
import { Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import DataFrame from "dataframe-js";
import {downloadSimResults} from "../Utilities/DownloadFunctions"
import GetAppIcon from '@material-ui/icons/GetApp';

const colorSC = "#044289"
const useStyles = {
    downloadButton: {
        border: '1px solid',
        color: colorSC,
        borderColor: colorSC,
        backgroundColor: "#FFFFFF",
        '&:hover': { 
            backgroundColor: colorSC,
            color: "#FFFFFF"
        }  
    }
}

export class DownloadSimResultsButton extends Component {
    state ={
        moduleList: [], 
        candidateData: {} 
    }
    componentDidMount() {
        this.props.getModuleList()
    }

    handleSubmit = (simResultsDF) => {
        downloadSimResults(simResultsDF)
    }

    render() {
        var {simResults} = this.props.moduleList 
        const {classes} = this.props
        simResults = new DataFrame(simResults, Object.keys(simResults))
        return (
            <Button 
                onClick = {() => this.handleSubmit(simResults)} 
                variant="contained" 
                color = "primary"
                disabled ={simResults.length === 0}
                className ={classes.downloadButton}
                startIcon={<GetAppIcon />}>
                {simResults.length === 0? 
                    "No Simulation Done" : <Typography variant={"button"}>Export Detailed Simulation</Typography>}
            </Button>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,  
  })

export default connect(mapStateToProps, {getModuleList})(withStyles(useStyles)(DownloadSimResultsButton))