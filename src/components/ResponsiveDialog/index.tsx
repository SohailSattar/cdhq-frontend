import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { DispatchContext, StateContext } from '../../context';
import * as Actions from '../../context/Actions';
import { Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});


export default function ResponsiveDialog() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useContext(DispatchContext);
  const contextState = useContext(StateContext);
  const {openDialog  = false} = contextState


  const handleClose = () => {
    dispatch(Actions.setDialogOpen(false))
  };

  return (
    <div>
       <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
          Sorry, your session has expired due to inactivity. Please login again. 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}