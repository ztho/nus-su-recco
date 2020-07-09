import React, { Component } from 'react'
import {getModuleList} from "../../actions/moduleListActions"
import {connect} from "react-redux"
import { Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import DataFrame from "dataframe-js";
import {downloadModuleList} from "../../Utilities/DownloadFunctions"
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

export class DownloadModuleListButton extends Component {
    state ={
        moduleList: [], 
        candidateData: {} 
    }
    componentDidMount() {
        this.props.getModuleList()
    }

    handleSubmit = (moduleListDF) => {
        downloadModuleList(moduleListDF)
    }

    render() {
        var {moduleList} = this.props.moduleList 
        const {classes} = this.props
        moduleList = new DataFrame(moduleList, ["moduleCode", "moduleTitle", "moduleCredit", "grade", "su"]).drop("su")
        return (
            <Button 
                onClick = {() => this.handleSubmit(moduleList)} 
                variant="contained" 
                color = "primary"
                disabled ={moduleList.length === 0}
                className ={classes.downloadButton}
                startIcon={<GetAppIcon />}>
                {moduleList.length === 0? 
                    "No Modules" : <Typography variant={"button"}>Download</Typography>}
            </Button>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,  
  })

export default connect(mapStateToProps, {getModuleList})(withStyles(useStyles)(DownloadModuleListButton))