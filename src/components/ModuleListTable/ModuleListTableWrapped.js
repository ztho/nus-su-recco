import React, { Component } from 'react'
import ModuleListTable from "./ModuleListTable"
import { Card, 
        CardHeader, 
        CardContent,
        CardActions,
        Grid,
        Fade,
        Divider} from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import AddModuleForm from "../AddModuleForm"
import ModuleListModal from "../ModuleListModal"
import ClearAllButton from "../ClearAll"
import DownloadModuleListButton from "../DownloadModuleListButton"
import SimulateButton from "../SimulateButton"
import {connect} from "react-redux"

const useStyles = {
    cardContainer: {
        border: '1px solid',
        borderColor: '#E7EDF3',
        borderRadius: 4,
        transition: '0.4s',
        '&:hover': { 
            borderColor: "#5B9FED"
        } 
    },
    cardHeader: {
        action: {
            padding: "20"
        }
    },
    cardContent: {
        padding: 0
    },
    bottomActions: {
        justifyContent: 'flex-end',
        height: 50
    },
}
export class ModuleListTableWrapped extends Component {
    render() {
        const {classes} = this.props
        const {moduleList} = this.props.moduleList
        return (
        <Card className = {classes.cardContainer}>
            <CardHeader title ="Module List"  titleTypographyProps={{variant:'h6' }} className={classes.cardHeader} action={<AddModuleForm />} />
            <Divider />
            <CardContent className = {classes.cardContent}>
                <ModuleListTable />
            </CardContent> 
            <Divider />
            {moduleList.length !== 0 ? 
            <Fade in ={true} timeout = {500}>
            <CardActions className ={classes.bottomActions}>
                <Grid container justify ="flex-end" spacing ={2} alignItems = "center"> 
                    <Grid item>
                        <ClearAllButton />
                    </Grid>
                    <Grid item> 
                        <DownloadModuleListButton />
                    </Grid>
                    <Grid item> 
                        <SimulateButton />
                    </Grid>
                    <Grid item> 
                        <ModuleListModal />
                    </Grid>
                </Grid>
            </CardActions></Fade> : null }
      </Card> 
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList
})

export default connect(mapStateToProps)(withStyles(useStyles)(ModuleListTableWrapped))
