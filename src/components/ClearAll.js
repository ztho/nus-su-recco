import React, { Component } from 'react'
import {clearAll} from "../actions/moduleListActions"
import {connect} from "react-redux"
import { Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const colorSC = "#cb2431"
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

export class ClearAllButton extends Component {
    state ={
        moduleList: [], 
        candidateData: {} 
    }

    handleSubmit = () => {
        this.props.clearAll()
    }

    render() {
        const {classes} = this.props
        return (
            <Button 
                onClick = {() => this.handleSubmit()} 
                variant="contained" 
                color = "primary"
                className ={classes.simulateButton}>
                Clear Module List   
            </Button>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList, 
    candidateData: state.candidateData 
  })

export default connect(mapStateToProps, {clearAll})(withStyles(useStyles)(ClearAllButton))
