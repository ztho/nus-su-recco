
import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"; 
import AppNavBar from "./components/AppNavbar";
import AddKeyData from "./components/AddKeyData";
import CurrentReportCard from "./components/CurrentReportCard"; 
import ModuleListTableWrapped from "./components/ModuleListTable/ModuleListTableWrapped";
import Graphs from "./components/SimulationGraphs"; 
import ResultsTable from "./components/ResultsTable";
import {Grid} from "@material-ui/core"
//import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'; 
import { Provider } from "react-redux"; 
import store from "./store"; 

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
      <div className="App">
        <AppNavBar />
        <div style={{ padding: 10, paddingTop:0 }}>
        <Grid container spacing = {3} style={{paddingLeft: 10, paddingRight: 10}} alignItems="stretch"> {/*Main container*/}
          <Grid item lg={9} md ={12} xl={9} xs={12} >
            <ModuleListTableWrapped />
          </Grid>
          <Grid container item lg={3} md={12} xl={3} xs={12} spacing ={3} alignItems="stretch"> 
            <Grid item lg ={12} md = {6} xl = {12} xs = {12} >
              <CurrentReportCard />
            </Grid>
            <Grid item lg ={12} md = {6} xl = {12} xs = {12}>
            <AddKeyData /> 
            </Grid>
          </Grid>
          <Grid item lg = {6} md = {6} xl = {6} xs = {12}>
                <ResultsTable />
            </Grid>
          <Grid item lg = {6} md = {6} xl = {6} xs = {12}>
              <Graphs />   
            </Grid>
        </Grid>
        </div> 
      </div>
      </Provider>
    );
  }
}

export default App;
