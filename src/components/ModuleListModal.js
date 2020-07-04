import React, { Component } from 'react'
import { Modal, 
         Backdrop,
         Fade,
         Card,
         CardHeader,
         CardContent,
         Tooltip,
         IconButton } from "@material-ui/core"
import AddModuleForm from "./AddModuleForm"; 
import ModuleListTable from "./ModuleListTable/ModuleListTable"
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { withStyles } from '@material-ui/styles';

const useStyles = {
    modal: {
        top: "50%",
        margin: "auto",
        display:'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        outline: 0,
    }, 
    cardContainer: {
        outline: 0,
        padding: 5,
    },
    cardContent: {
        padding: 1,
    }
}
export class ModuleListModal extends Component {
    state = {
        modal: false
    }
    
    toggle = () => {
        this.setState({
            modal: !this.state.modal 
        })
    }
    render() {
        const {classes} = this.props
        return (
            <div>
            <Tooltip 
                title = "Expand Table" 
                placement = "right-start"
                style ={{fontSize: 50}}
                TransitionComponent={Fade} 
                TransitionProps={{ timeout: 500 }}>
            <IconButton onClick ={() => this.toggle()}> 
                <OpenInNewIcon/>
            </IconButton>
            </Tooltip>
            <Modal 
                open = {this.state.modal}
                onClose ={this.toggle}
                closeAfterTransition
                className = {classes.modal}
                BackdropComponent ={Backdrop}
                BackdropProps ={
                    {timeout: 500}
                }
                >
                <Fade in={this.state.modal}>
                    <Card className ={classes.cardContainer}>
                        <CardHeader action = {<AddModuleForm />} />
                            <CardContent className = {classes.cardContent}>
                                <ModuleListTable tableHeight = {500}/>
                            </CardContent>
                    </Card>
                </Fade>
            </Modal>
            </div>
        )
    }
}

export default withStyles(useStyles)(ModuleListModal)
