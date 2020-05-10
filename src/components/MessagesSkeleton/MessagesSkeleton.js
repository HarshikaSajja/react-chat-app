import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(() => ({
  card: {
    // maxWidth: 345,
    boxShadow: 'none'
  },
  media: {
    height: 190,
  },
}));

const StyledSkeleton = withStyles({
    root: {
      background: 'rgba(0,0,0,0.1)'
    }
})(Skeleton);

const StyledCardHeader = withStyles({
    root: {
      padding: 0
    }
})(CardHeader);

function Media() {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <StyledCardHeader
        avatar={<StyledSkeleton animation="wave" variant="rect" width={40} height={40}/>}
        title={<StyledSkeleton animation="wave" height={23} width={80}/>}
        subheader={<StyledSkeleton animation="wave" height={22} width={700}/>}
      />      
    </Card>
  );
}

export default function Facebook() {
  return (
    <div>
      <Media/>
    </div>
  );
}