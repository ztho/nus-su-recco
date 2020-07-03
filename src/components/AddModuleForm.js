import React from "react";
import "../App.css"
import { MenuItem, Button, Grid, TextField} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {Grades} from "../Utilities/Grades";
import {MasterModuleList} from "../Utilities/MasterModuleList"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {addModule, getModuleList} from "../actions/moduleListActions"
import { withStyles } from '@material-ui/styles';


const useStyles = {
  addModButton: {
      border: '1px solid',
      color: "#34d058",
      borderColor: "#34d058",
      backgroundColor: "#FFFFFF",
      '&:hover': { 
          backgroundColor: "#34d058",
          color: "#FFFFFF"
      }  
  }
}

class AddModuleForm extends React.Component {
  state = {
    moduleCode: "", 
    moduleTitle: "", 
    moduleCredit: "", 
    grade: "", 
    su: false,
    suggestions: [],
    moduleCodeInput: "", 
    moduleGradeInput: "", 
    errors: {}
  };

  static propTypes = {
    moduleList: PropTypes.object.isRequired,
    getModuleList: PropTypes.func.isRequired,
    addModule: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getModuleList(); 
  }

  change = e => {
      this.setState({
        [e.target.name]: e.target.value.trim().toUpperCase(),
        errors: {}
      });
  }

  onModuleCodeChange = (e, val) => {
    if (val !== null && typeof val.moduleCode !== "undefined") {
      this.setState({
        moduleCode: val.moduleCode.trim().toUpperCase(), 
        moduleTitle: val.moduleTitle,
        moduleCodeInput: val.moduleCode.trim(), 
        moduleCredit: val.moduleCredit
      })
    } else if (val !== null && typeof val.moduleCode === "undefined"){
      this.setState({
        moduleCode: val.trim().toUpperCase(),
        moduleTitle: "", 
        moduleCodeInput: val.trim(), 
        moduleCredit: ""
      })
    } else {
      this.setState({
        moduleCredit: ""
      })
    } 
  }

  onModuleInputValueChange = (e, val) => {
      if (val.length > 0) {
        var evalVal = val.trim()
        evalVal = evalVal.replace(/\\/g, "")//prevent regex error  
        const regex = new RegExp(`^${evalVal}`, "i", "g");
        if (evalVal !== "") {
          MasterModuleList.then(data => {
            this.setState({
              suggestions: data.filter(mod => regex.test(mod.moduleCode))
            })
          })
        }
      } else {
        this.setState({
          moduleCode: ""
        })
      }
    this.setState({
      moduleCodeInput: val
    })
  }

  validate = () => {
    const errors = {
      isError: false,
      moduleCodeError: "",
      moduleCreditError: "" ,
      gradeError: ""
    };

    //check for valid module length
    if (this.state.moduleCode.length < 5) {
      errors.isError = true;
      errors.moduleCodeError = "Enter Valid Module Code";
    }

    //Check module not repeated 
    if (this.props.moduleList.moduleList.find(mod => mod.moduleCode === this.state.moduleCode)) {
      errors.isError = true;
      errors.moduleCodeError = "Repeated Module" 
    }

    //check module credit isNumber
    if (!parseInt(this.state.moduleCredit)) {
      errors.isError = true
      errors.moduleCreditError = "Enter Numbers Only"
    }

    //check moduleCredit is not empty 
    if (this.state.moduleCredit === "") {
      errors.isError = true 
      errors.moduleCreditError = "No Module Credit Entered"
    }

    //check grade is entered 
    if (this.state.grade === "") {
      errors.isError = true 
      errors.gradeError = "Please Enter Grade"
    }

    this.setState({
      ...this.state,
      ...errors
    });

    return errors; 
  };

  onSubmit = e => {
    e.preventDefault();
    const err = this.validate();
    if (!err.isError) {
      const {moduleCode, moduleTitle, moduleCredit, grade, su} = this.state
      const newMod = {moduleCode, moduleTitle, moduleCredit, grade, su}
      this.props.addModule(newMod)
      // clear form
      this.setState({
        moduleCode: "",
        moduleTitle: "",  
        moduleCodeInput: "",
        moduleCredit: "", 
        grade: "", 
        su: false,
        errors: {}
      });
    } else {
      this.setState({
        errors: err
      })
    }
  };

  getModuleDesc = (mod) => {
    var modDesc = ""
    if (mod !== null) {
      try {
        modDesc = mod.moduleCode.concat(" ").concat(mod.moduleTitle)
      } catch(err) {
        modDesc = mod 
      }
      return modDesc
    }
  }

  render() {
    const {classes} = this.props
    return (
      <form className = "add-module-form" autoComplete ="off">
        <Grid container spacing ={2} alignItems = "center" direction = "row" justify = "flex-end">
          <Grid item>
            <Autocomplete
                freeSolo = {true}
                autoHighlight ={true}
                disableClearable={true}
                id ="standard-error-helper-text"
                onChange = {(e, val) => this.onModuleCodeChange(e, val)}
                inputValue = {this.state.moduleCodeInput}
                onInputChange = {(e, val) => this.onModuleInputValueChange(e, val)}
                options={this.state.suggestions.splice(0,10)}
                getOptionLabel = {mod => this.getModuleDesc(mod)}
                style={{ width: 200}}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error = {this.state.errors.isError && this.state.errors.moduleCodeError !== "" }
                    helperText = {this.state.errors.moduleCodeError}
                    label= "Module Code"
                    name = "moduleCode"
                    value = {this.state.moduleCode}
                    onChange = {e => this.change(e)}
                    InputProps={{ ...params.InputProps, type: 'search' }}
                  />
               )}
              />
          </Grid>
          <Grid item xs = {3}>  
            <TextField
              error = {this.state.errors.isError && this.state.errors.moduleCreditError !== "" }
              name="moduleCredit"
              label ="Module Credits" 
              helperText = {this.state.errors.moduleCreditError}
              value={this.state.moduleCode !== ""? this.state.moduleCredit : ""}
              onChange={e => this.change(e)}
            /> 
          </Grid>
          <Grid item>
            <TextField
              error = {this.state.errors.isError && this.state.errors.gradeError !== "" }
              select
              label = "Select"
              name="grade"
              label ="Grade"
              value={this.state.grade}
              className = "input-field"
              onChange={e => this.change(e)}
              style = {{width: 100}} 
            >
              {Grades.map(o => (
                <MenuItem key = {o.value} value = {o.value}> {o.label} </MenuItem>)
                )}
            </TextField>
          </Grid>
        <Grid item>
          <Button 
                variant="contained" 
                color = "primary"
                className ={classes.addModButton}
                onClick={e => this.onSubmit(e)}>
                Add Module 
            </Button>
        </Grid>
        </Grid>
      </form>
    );
  }
}

const mapStateToProps = (state) => ({
  moduleList: state.moduleList, 
})

export default connect(mapStateToProps, {addModule, getModuleList})(withStyles(useStyles)(AddModuleForm)) 