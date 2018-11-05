import React from 'react';
import {withStyles, CircularProgress} from '@material-ui/core';

export default withStyles({
    progressContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        background: '#fff'
    },
    progress: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        margin: 'auto'
    }
})(({classes}) => (
    <div className={classes.progressContainer}>
        <CircularProgress className={classes.progress}/>
    </div>
));