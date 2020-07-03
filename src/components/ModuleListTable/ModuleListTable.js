import React, {Component} from "react";
import { Table,
         TableContainer,
         TableBody, 
         TableHead, 
         TableRow, 
         TableCell,
         Typography} from "@material-ui/core"
import { withStyles } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';
import TextField from "@material-ui/core/TextField";
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import {Grades} from "../../Utilities/Grades"
import {getModuleList, deleteModule, updateModuleList} from "../../actions/moduleListActions"
import PropTypes from "prop-types"
import {connect} from "react-redux"

const nonCountedGrades = ["CS", "CU", "S", "U"]
const useStyles = theme => ({
  table: {
    //maxHeight: 300,
    minWidth: 500
  },
  tableHeader: {
    fontSize: 12,
    fontWeight: "bold",
    align :"left",
  },
  tableHeaderText: {
    fontSize: 14, 
    fontWeight: "bold",
  }
})

class ModuleListTable extends Component {
  state = {
    header:[
      {
        name: "Module Code",
        prop: "moduleCode",
        width: "15%"
      },
      {
        name: "Module Title",
        prop: "moduleTitle",
        width: "15%"
      },  
      {
        name: "Module Credit",
        prop: "moduleCredit",
        width: "20%" 
      },
      {
        name: "Grade",
        prop: "grade",
        width: "10%"
      },
      {
        name: "Considering SU?",
        prop: "su",
        width: "10%"
      }
    ],
    moduleList: [], 
    editIdx: -1,
    hover: false,
    errors: {}
  }
  
  static propTypes = {
    moduleList: PropTypes.object.isRequired,
    getModuleList: PropTypes.func.isRequired,
    deleteModule: PropTypes.func.isRequired,
    updateModuleList: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props.getModuleList(); 
  }

  handleRemove = (x) => {
    this.props.deleteModule(x)
  }
  
  startEditing = i => {
    this.setState({editIdx: i})
  }
  
  stopEditing = (mod, i) => {
    const err = this.validate(mod, i)
    if(!err.isError) {
      this.setState({
        editIdx: -1,
        errors: {}
      }); 
    } else {
      this.setState({
        errors: err
      })
    }
  }

  validate = (mod, i) => {
    const errors = {
      isError: false,
      moduleCodeError: "",
      moduleCreditError: "" ,
      gradeError: ""
    };

    const otherMods = this.props.moduleList.moduleList.filter((o, j) => j !== i)

    //check for valid module length
    if (mod.moduleCode.length < 5) {
      errors.isError = true;
      errors.moduleCodeError = "Enter Valid Module Code";
    }

    //Check module not repeated 
    if (otherMods.find(o => o.moduleCode === mod.moduleCode)) {
      errors.isError = true;
      errors.moduleCodeError = "Repeated Module" 
    }

    //check module credit isNumber
    if (!parseInt(mod.moduleCredit)) {
      errors.isError = true
      errors.moduleCreditError = "Enter Numbers Only"
    }

    //check moduleCredit is not empty 
    if (mod.moduleCredit === "") {
      errors.isError = true 
      errors.moduleCreditError = "No Module Credit Entered"
    }

    //check grade is entered 
    if (mod.grade === "") {
      errors.isError = true 
      errors.gradeError = "Please Enter Grade"
    }
    return errors  
  }
  
  handleChange = (e, propName, i, mod) => {
    var { value } = e.target;
    this.props.updateModuleList(propName, i, value)
  }

  row = (
    mod, 
    i, 
    header, 
    editIdx) => {
      const curEditing = (editIdx === i); 
      return (
        <TableRow key={`tr-${i}`} selectable = "false">
          {header.map((y, k) => (
            <TableCell key={`trc-${k}`} width = {k !== 1 ? "15%" : "30%"} size = "small">
              {y.prop === "su" ? 
              <Checkbox 
                color = "primary" 
                disabled= {nonCountedGrades.indexOf(mod.grade) >= 0}
                name ={y.prop} 
                value = {(mod[y.prop])} 
                checked = {(mod[y.prop])}
                onChange={(e) => this.handleChange(e, y.prop, i, mod)} /> : 
              curEditing ? (
              y.prop === "grade" ? 
              <TextField 
                select
                name = {y.prop}
                onChange={(e) => this.handleChange(e, y.prop, i, mod)}
                value = {mod[y.prop]}
              > {Grades.map(o => (
                <MenuItem key = {o.value} value = {o.value}> {o.label} </MenuItem>)
                )}</TextField> : 
                y.prop === "moduleCode" ? 
              <TextField
                name={y.prop}
                error = {this.state.errors.isError && this.state.errors.moduleCodeError !== ""}
                helperText = {this.state.errors.moduleCodeError}
                onChange={(e) => this.handleChange(e, y.prop, i, mod)}
                value = {mod[y.prop]} 
              /> : 
              <TextField
              name={y.prop}
              error = {this.state.errors.isError && this.state.errors.moduleCredit !== ""}
              helperText = {this.state.errors.moduleCreditError}
              onChange={(e) => this.handleChange(e, y.prop, i, mod)}
              value = {mod[y.prop]} 
              />
              ) : (
              <Typography color = "textPrimary">{mod[y.prop]}</Typography>)}
            </TableCell>
          ))}
          <TableCell width = "5%"> {curEditing ? 
            (<IconButton  onClick={() => this.stopEditing(mod, i)}><CheckIcon /></IconButton>) :
            (<IconButton onClick = {() => this.startEditing(i)} ><EditIcon /></IconButton>)}
          </TableCell>
          <TableCell width = "5%"> 
            <IconButton onClick = {() => this.handleRemove(mod)}>
              <DeleteIcon />
            </IconButton>
          </TableCell>
          </TableRow>
      )
  }

  render() {
    const {moduleList} = this.props.moduleList
    const {classes} = this.props
    var theight = this.props.tableHeight
    if (typeof theight === "undefined") theight = 300
    return (
          <TableContainer className = {classes.table} style={{maxHeight: theight}} >
              <Table 
                selectable = "false" 
                stickyHeader
                size = "small"
                >
                <TableHead>
                  <TableRow>
                    {this.state.header.map((x, i) =>
                      <TableCell key={`thc-${i}`} width = {i !== 0 ? "1rem" : "3rem"} className = {classes.tableHeader}>
                        <Typography 
                          color = "textPrimary"
                          className={classes.tableHeaderText}>{x.name}</Typography>
                      </TableCell>
                    )}
                    <TableCell width = ".5rem"/>
                    <TableCell width = ".5rem"/>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {moduleList.map((x, i) => this.row(x, i, this.state.header, this.state.editIdx))}
                </TableBody>
              </Table>
              </TableContainer>
      )
  }
}

const mapStateToProps = (state) => ({
  moduleList: state.moduleList
})

export default connect(mapStateToProps, {getModuleList, deleteModule, updateModuleList})(withStyles(useStyles)(ModuleListTable)) 