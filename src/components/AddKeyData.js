import React, { Component } from 'react';
import { TextField,
         Grid,
         Card,
         CardHeader,
         CardContent,
         Divider,
         Typography,
         IconButton,
         InputLabel,
         Button,
         Fade} from "@material-ui/core"
import EditIcon from '@material-ui/icons/Edit';
//import {updateSim} from "../actions/moduleListActions"
import {getCandData, updateCandData, changeCandMC, changeCandSU} from "../actions/candidateDataActions"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import { withStyles } from '@material-ui/styles';

const colorSC = "#34d058"
const useStyles = theme => ({
    sendCandDataButton: {
        border: '1px solid',
        color: colorSC,
        borderColor: colorSC,
        backgroundColor: "#FFFFFF",
        '&:hover': { 
            backgroundColor: colorSC,
            color: "#FFFFFF"
        }  
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
    mainPoint: {
        color: "#044289"
    },
    subPoint: {
        color: "#6a737d"
    },
})
export class AddKeyData extends Component {
    state = {
        candidatureMC: "", //amount of MCs taken
        remainingSU: "",
        cMCerr: false,
        cMCerrMsg: "", 
        rSUerr: false,
        rSUerrMsg: "",
        showButton: true, 
        isSubmittedBefore: false,
    }

    static propTypes = {
        getCandData: PropTypes.func.isRequired,
        updateCandData: PropTypes.func.isRequired,
        candidateData: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.props.getCandData() 
        if (this.props.candidateData.candidatureMC !== -1) {
            const {candidatureMC, remainingSU} = this.props.candidateData
            this.setState({ 
                candidatureMC: candidatureMC,
                remainingSU: remainingSU,
                isSubmittedBefore: true,
                showButton: false
            })
        } 
    }

    change = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
            showButton: true
        }); 
    }

    validate = () => {
        const errors = {
            isError: false, 
            canMCErr: "", 
            remainingSUErr: "",
        };

        this.setState({
            cMCerr: false,
            rSUerr: false
        })
        if (!Number.isInteger(parseInt(this.state.candidatureMC)) ) {
            this.setState({
                cMCerr: true,
                cMCerrMsg: "Enter Numbers Only"
            })
            errors.isError = true;
            errors.canMCError = "Enter Number Only";
        }
        if (parseInt(this.state.candidatureMC) < 120) {
            this.setState({
                cMCerr: true, 
                cMCerrMsg: "Minimum Graduation Requirements is 120 MCs"
            })
            errors.isError = true
        }
        /*if (this.state.candidatureMC === "") {
            this.setState({
                cMCerr: false,
                cMCerrMsg: ""
            })
            errors.isError = false
        }*/
        if (parseInt(this.state.remainingSU) < 0 ){
            this.setState({
                rSUerr: true,
                rSUerrMsg: "Enter Positive Numbers Only"
            })
            errors.isError = true;
        }
        if (!Number.isInteger(parseInt(this.state.remainingSU))){
            this.setState({
                rSUerr: true,
                rSUerrMsg: "Enter Numbers Only"
            })
            errors.isError = true;
            errors.remainingSUErr = "Enter Number Only";
        }
        /*if (this.state.remainingSU === "") {
            this.setState({
                rSUerr: false,
                rSUerrMsg: ""
            })
            errors.isError = false
        }*/
        return errors
    }
    
    onSubmit = e => {
        e.preventDefault();
        const err = this.validate();
        if (!err.isError) {
          //this.props.onSubmit(this.state); //give to App.js
          const newData = {candidatureMC: this.state.candidatureMC, remainingSU: this.state.remainingSU}
          this.props.updateCandData(newData)
          //this.props.updateSim(this.props.moduleList.moduleList, newData.candidatureMC, newData.remainingSU)
          this.setState({
              showButton: false,
              isSubmittedBefore: true,
              cMCerr: false,
              cMCerrMsg: "", 
              rSUerr: false,
              rSUerrMsg: "",
          })
        }
    };

    toggleEdit = () => {
        this.setState({
            showButton: !this.state.showButton
        })
    }

    render() {
        const {classes} = this.props
        const {candidatureMC, remainingSU} = this.props.candidateData
        return (
            <Card className = {classes.cardContainer}>
                <CardHeader 
                    title="Candidature Data" 
                    titleTypographyProps={{variant:'h6' }}
                    action={!this.state.showButton ? <Fade in={true} timeout={500}><IconButton onClick={() => this.toggleEdit()}><EditIcon /></IconButton></Fade> : null} 
                />
                <Divider />
                    <CardContent>
            {this.state.showButton ? 
            <Fade in={true} timeout={500}>
            <form className = "add-key-data-form" autoComplete ="off">
                <Grid container spacing ={3} alignItems = "center" direction = "row" justify = "flex-start">
                <Grid item>
                <InputLabel> Total Candidature MC (eg. 160) </InputLabel>
                <TextField
                    name="candidatureMC"
                    error = {this.state.cMCerr}
                    id = "candidatureMC"
                    type = "text"
                    helperText = {this.state.cMCerrMsg}
                    value={this.state.candidatureMC}
                    onChange={e => this.change(e)}
                    /> 
                </Grid>
                <Grid item>
                <InputLabel> Expected Remaining SUs and CS/CU Mods </InputLabel>
                    <TextField
                    name="remainingSU"
                    error ={this.state.rSUerr}
                    helperText = {this.state.rSUerrMsg}
                    type = "text"
                    value={this.state.remainingSU}
                    onChange={e => this.change(e)}
                    />
                    </Grid>
                    {this.state.showButton ? 
                    <Grid item>
                        <Fade in ={this.state.showButton} timeout ={500}>
                        <Button 
                            onClick={e => this.onSubmit(e)}
                            variant="contained" 
                            color = "primary"
                            className ={classes.sendCandDataButton}
                            >
                            {this.state.isSubmittedBefore ? "Update Details" : "Confirm Details" }
                        </Button> 
                        </Fade>
                    </Grid> 
                    : null} 
                    </Grid>
                </form>
                </Fade>:
                <Fade in={true} timeout={500}>
                <Grid container justify = "space-between">
                <Grid container justify = "space-between" alignItems="center">
                    <Grid item>
                        <Typography display = "inline" color = "textSecondary" gutterBottom variant={"body1"} align="left" className={classes.mainPoint}>
                        Candidature MCs
                        </Typography>
                    </Grid>
                    <Grid item> 
                        <Typography display = "inline" color = "primary" className={classes.mainPoint} gutterBottom variant={"h4"} align="left">
                        {candidatureMC}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container justify = "space-between" alignItems="center"> 
                    <Grid item>
                        <Typography display = "inline" color = "textSecondary" gutterBottom variant={"body2"} align="left">
                        Expected Remaining SUs and CS/CU Mods
                        </Typography>
                    </Grid>
                    <Grid item> 
                        <Typography display="inline" variant={"h6"} align="right" className={classes.subPoint}> 
                        {remainingSU} 
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            </Fade>
                }
                </CardContent>
                </Card>
                    )
                }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,
    candidateData: state.candidateData
})


export default connect(mapStateToProps, { getCandData, updateCandData, changeCandMC, changeCandSU})(withStyles(useStyles)(AddKeyData)); 
