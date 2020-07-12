import React, { Component } from 'react'
import { Card, 
    CardHeader, 
    CardContent,
    Divider, 
    Typography, Grid} from "@material-ui/core"
import {getModuleList} from "../actions/moduleListActions"
import {getCandData} from "../actions/candidateDataActions";
import {connect} from "react-redux"
import { withStyles } from '@material-ui/styles';
import Calculations from "../calculations/Calculations";

const useStyles = {
    mainPoint : {
        color: "#28a745"
    },
    subPoint: {
        color: "#6a737d"
    },
    cardHeader: {
        fontSize: 12
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
}

export class CurrentReportCard extends Component {
    state = {
        curCap: 0,
        maxAchievableCap: 0, 
    }

    render() {
        const curStats = Calculations.getStats(this.props.moduleList.moduleList)
        var {candidatureMC, remainingSU} = this.props.candidateData
        const {classes} = this.props
        var maxCap = 0, diff = 0 
        var hasCandData = false; 
        if (candidatureMC !== -1){
            hasCandData = true 
            maxCap = Calculations.getMaxCap(this.props.moduleList.moduleList, candidatureMC, remainingSU)
            diff = Calculations.getDiff(this.props.moduleList.moduleList, candidatureMC, remainingSU)
        }
        return (
            <Card className = {classes.cardContainer}>
                <CardHeader title = "Current Stats" className ={classes.cardHeader} titleTypographyProps={{variant:'h6'}}/>
                <Divider />
                <CardContent>
                    <Grid container justify = "space-between">
                        <Grid container justify = "space-between" alignItems="center">
                            <Grid item>
                                <Typography display = "inline" color = "textSecondary" gutterBottom variant={"body1"} align="left" className={classes.mainPoint}>
                                Current CAP
                                </Typography>
                            </Grid>
                            <Grid item> 
                                <Typography display = "inline" color = "primary" className={classes.mainPoint} gutterBottom variant={"h4"} align="left">
                                {curStats.curCAP[0]}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify = "space-between" alignItems="center"> 
                            <Grid item >
                                <Typography display = "inline" color = "textSecondary" gutterBottom variant={"body2"} align="left" className={classes.subPoint}>
                                Total MCs Completed
                                </Typography>
                            </Grid>
                            <Grid item> 
                                <Typography display="inline" variant={"h6"} align="right" className={classes.subPoint}> 
                                {hasCandData ? curStats.cumMC[0] + curStats.cumNGMC[0] : null } 
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify = "space-between" alignItems="center"> 
                            <Grid item >
                                <Typography display = "inline" color = "textSecondary" gutterBottom variant={"body2"} align="left">
                                Max Attainable CAP
                                </Typography>
                            </Grid>
                            <Grid item> 
                                <Typography display="inline" variant={"h6"} align="right" className={classes.subPoint}> 
                                {hasCandData ? maxCap : null } 
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container justify = "space-between"  alignItems="center">
                            <Grid item>
                            <Typography display = "inline" color = "textSecondary" gutterBottom variant={"body2"} align="left">
                                Sensitivity
                                </Typography>
                            </Grid>
                            <Grid item> 
                                <Typography display = "inline" color = "primary" className={classes.subPoint} gutterBottom variant={"h6"} align="left">
                                {hasCandData ? diff : null } 
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,
    candidateData: state.candidateData
})

export default connect(mapStateToProps, {getModuleList, getCandData})(withStyles(useStyles)(CurrentReportCard))
