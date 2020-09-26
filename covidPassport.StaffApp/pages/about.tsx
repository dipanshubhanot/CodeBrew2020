import React from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import {Box} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";


const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },
    textAlign: {
        textAlign : 'center'
    }
});

export default function About() {
    const classes = useStyles();

    return (

        <React.Fragment>
            <Box component="span" className={classes.textAlign}>
                <Typography variant="h2" gutterBottom  >
                    Appointment
                </Typography>
            </Box>

            <Card className={"margin"}>

                <CardMedia
                    className={classes.media}
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Profile pic"
                />
                <CardContent>
                    <Typography gutterBottom variant="h4" component="h2">
                        Full Name
                    </Typography>
                    <Typography variant="h4"  component="p">
                        Date & Time
                    </Typography>
                </CardContent>

                <CardActions>
                    <TextField id="standard-basic" label="Test Results" />
                    <Button size="small" color="primary">
                        Update
                    </Button>
                </CardActions>
            </Card>

            <style jsx global>{
                `.margin{margin: auto; width: 80%}
              .align{align-text: center}
              `
            }

            </style>
        </React.Fragment>

    );
}
