import React, { Component } from 'react'
import {Scatter, Chart} from "react-chartjs-2"; 
import { Card, 
         CardHeader, 
         CardContent,
         CardActions,
         Grid,
         Typography, 
         Switch } from "@material-ui/core"
import Calculations from "../calculations/Calculations"
import {connect} from "react-redux"
import { withStyles } from '@material-ui/styles';

const colorSC = "#044289"
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
    switchBase: {
        color: colorSC,
        '&$checked': {
          color: colorSC
        },
        '&$checked + $track': {
          backgroundColor: colorSC
        },
    },
    checked: {},
    track: {},
    thumb:{},
    switchLabelOn: {
        fontWeight: "bold",
        color:colorSC
    }
}
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const drawVerticalLine = {
    id: "drawVert",
    afterDraw: function(chart, easing) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const activePoint = chart.controller.tooltip._active[0];
            const ctx = chart.ctx;
            const x = activePoint.tooltipPosition().x;
            const topY = chart.scales['y-axis-1'].top;
            const bottomY = chart.scales['y-axis-1'].bottom;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 2;
            //ctx.strokeStyle = '#e23fa9';
            ctx.strokeStyle = "#34d058";
            ctx.stroke();
            ctx.restore();
        }
    }
}
    
const drawHorizontalLine = {
    id: "drawHort",
    afterDraw: function(chart, easing) {
        if (chart.tooltip._active && chart.tooltip._active.length) {
            const activePoint = chart.controller.tooltip._active[0];
            const ctx = chart.ctx;
            const y = activePoint.tooltipPosition().y;
            const topX = chart.scales['x-axis-1'].right;
            const bottomX = chart.scales['x-axis-1'].left;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(topX, y);
            ctx.lineTo(bottomX, y);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#34d058';
            ctx.stroke();
            ctx.restore();
        }
    }
}

const drawVert = (vertRef) => {
    if (vertRef) {
        Chart.pluginService.register(drawVerticalLine)
        Chart.pluginService.unregister(drawHorizontalLine) 
    } else {
        Chart.pluginService.register(drawHorizontalLine)
        Chart.pluginService.unregister(drawVerticalLine) 
    }
}



class Graphs extends Component {
    state = {
        vertRef: true //by default, will use vertical line as ref
    }

    toggleView = () => {
        this.setState({
            vertRef: !this.state.vertRef
        })
    }
    render() {
        const {candidatureMC} = this.props.candidateData
        const {classes} = this.props
        var simResults = [] 
        drawVert(this.state.vertRef)
        if (candidatureMC !== -1){
            //simResults = Calculations.getSimResults(this.props.moduleList.moduleList, candidatureMC, remainingSU)
            simResults = this.props.moduleList.simResults
        } 
        var nameLabel = Object.keys(simResults); 
        var datas = Object.values(simResults)
        var loadDataSet = []
        for (var ds = 1; ds <datas.length; ds ++){ //for each dataset except the first (which is gradCAP)
            var set = []
            for (var i = 0; i < datas[ds].length; i++) {
                set.push({x: datas[ds][i], y: datas[0][i]})
            }
            var borderColor = getRandomColor()
            if (ds === 1){
                borderColor = 'rgba(75,192,192,1)' //if it's the default (no SU case, set color)
            }
            loadDataSet.push({
                label: nameLabel[ds],
                data: set,
                showLine: true,
                fill:false,
                pointRadius: 0.1, 
                borderColor: borderColor,
                backgroundColor: borderColor,
            })
        }
        const data = {
            datasets: loadDataSet
        }
        var refMode = "x"
        if (!this.state.vertRef) refMode = "y"
        return (
            <Card className ={classes.cardContainer}>
                <CardHeader title="Simulation Profile"  titleTypographyProps={{variant:'h6' }} />
                <CardContent>
                <Scatter 
                    data ={data} 
                    width ={200} 
                    height = {100} 
                    options = {
                        {maintainAspectRatio: false},
                        {scales: {
                            xAxes:[{
                                display: true, 
                                scaleLabel: {
                                    display:true,
                                    labelString: "Required Average Performance"
                                },
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    callback: function(value) {
                                        return (Calculations.mapGradeToPoints.find({"points": value}) ? Calculations.mapGradeToPoints.find({"points": value}).get("grade"): value)
                                    },
                                }
                            }],
                            yAxes:[{
                                scaleLabel:{
                                    display: true,
                                    labelString: "Target Graduation Cap"
                                },
                                ticks: {
                                    beginAtZero: false
                                }
                            }]
                        },
                        tooltips: {
                            mode: refMode,
                            callbacks: {
                                label: function(tooltipItem, data) {
                                    var label = data.datasets[tooltipItem.datasetIndex].label || '' 
                                    if (label) {
                                        label += "- Target Grad Cap: ";
                                    }
                                    label += (Math.round(tooltipItem.yLabel * 100) / 100).toFixed(2)
                                    label += "\n Req Avg Performance "
                                    label += (Math.round(tooltipItem.xLabel * 100) / 100).toFixed(2)
                                    return label;
                                },
                                labelColor: function(tooltipItem, chart) {
                                    return {
                                        borderColor: data.datasets[tooltipItem.datasetIndex].borderColor,
                                        backgroundColor: data.datasets[tooltipItem.datasetIndex].borderColor
                                    };
                                }
                            }   
                        },
                        legend: {
                            position: "bottom"
                        }
                        }
                    }
                />
               </CardContent>
               <CardActions>
                <Grid container spacing={1} justify="flex-end" alignItems="center">
                    <Grid item>
                        <Typography className={!this.state.vertRef ? classes.switchLabelOn : null}>Reference Horizontal</Typography>
                    </Grid>
                    <Grid item>
                        <Switch classes={{switchBase: classes.switchBase,
                                        thumb: classes.thumb,
                                        track: classes.track,
                                        checked: classes.checked}}
                            checked={this.state.vertRef}
                            onChange={() => this.toggleView()}
                            color="primary"
                        />
                    </Grid>
                    <Grid item>
                        <Typography className={this.state.vertRef ? classes.switchLabelOn : null}>Reference Vertical</Typography>                       
                    </Grid>
                </Grid>
               </CardActions>
               </Card>
        )
    }
}

const mapStateToProps = (state) => ({
    moduleList: state.moduleList,
    candidateData: state.candidateData
})
  
export default connect(mapStateToProps)(withStyles(useStyles)(Graphs)) 

