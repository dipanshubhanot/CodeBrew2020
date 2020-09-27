import {Container} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

import Typography from "@material-ui/core/Typography";


// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "../src/components/Header/Header.js";
import HeaderLinks from "../src/components/Header/HeaderLinks.js";
import Footer from "../src/components/Footer/Footer.js";
import GridContainer from "../src/components/Grid/GridContainer.js";
import GridItem from "../src/components/Grid/GridItem.js";
import CardBody from "../src/components/Card/CardBody.js";
import CardFooter from "../src/components/Card/CardFooter.js";
import CustomInput from "../src/components/CustomInput/CustomInput.js";


import styles from "../src/assets/jss/material-kit-react/views/loginPage.js";


// const { ...rest } = props;


export default function Index() {
// card animation
const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
setTimeout(function() {
  setCardAnimation("");
}, 700);

const useStyles = makeStyles(styles);
const classes = useStyles();

    return (
        <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + "/bg7.jpg" + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height:"100vh",
          margin:"-50px 0"
          
        }}
      >
        <div className={classes.container} style={{textAlign:"center"}}>
        <Typography variant="h2" className="centerText" style={{margin:"50px"}}>
                Covid Passport: Health Professional Login
        </Typography>
            <Card>
                <CardHeader title="Login Using the Medical Credentials Provided to You" />
                <CardContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                    />
                </CardContent>
                <CardActions>
                    <Link href="/mainPage">
                    <Button variant="contained" color="primary">
                        Log In
                    </Button>
                    </Link>
                    <Button variant="contained" color="primary">
                        Sign Up
                    </Button>
                </CardActions>
            </Card>

        </div>
        </div>
    );
}
