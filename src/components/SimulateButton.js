import React, { Component } from 'react'
import {getModuleList, updateSim} from "../actions/moduleListActions"
import {getCandData} from "../actions/candidateDataActions";
import {connect} from "react-redux"
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const colorSC = "#34d058"
const useStyles = {
    simulateButton: {
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

export class SimulateButton extends Component {
    state ={
        moduleList: [], 
        candidateData: {} 
    }

    componentDidMount() {
        this.props.getModuleList()
        this.props.getCandData() 
    }

    handleSubmit = (moduleList, candidatureMC, remainingSU) => {
        this.props.updateSim(moduleList, candidatureMC, remainingSU)
    }

    render() {
        const {moduleList} = this.props.moduleList 
        const {candidatureMC, remainingSU} = this.props.candidateData
        const {classes} = this.props
        return (
            <Button 
                onClick = {() => this.handleSubmit(moduleList, candidatureMC, remainingSU)} 
                variant="contained" 
                color = "primary"
                disabled ={this.props.candidateData.candidatureMC === -1 || moduleList.length === 0}
                className ={classes.simulateButton}>
             {this.props.candidateData.candidatureMC === -1 ? moduleList.length === 0? 
                    "No Modules" : "Enter Candidature Data First" : "Simulate"}
            </Button>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList, 
    candidateData: state.candidateData 
  })

export default connect(mapStateToProps, {getModuleList, getCandData, updateSim})(withStyles(useStyles)(SimulateButton))
