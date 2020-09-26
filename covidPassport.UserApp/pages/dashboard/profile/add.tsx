import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import Camera from "react-html5-camera-photo";
import CovidPassportService from "../../../services/CovidPassportService";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Header from "../../../src/components/Header/Header.js";
import Footer from "../../../src/components/Footer/Footer.js";
import GridContainer from "../../../src/components/Grid/GridContainer.js";
import GridItem from "../../../src/components/Grid/GridItem.js";
// import Button from "../../../src/components/CustomButtons/Button.js";
import HeaderLinks from "../../../src/components/Header/HeaderLinks.js";
import Parallax from "../../../src/components/Parallax/Parallax.js";
import styles from "../../../src/assets/jss/material-kit-react/views/landingPage.js";
export default function Index() {
  const [name, setName] = React.useState("");
  const [photo, setPhoto] = React.useState("");

  const takePhoto = (dataUri: string) => {
    console.log(dataUri);
    setPhoto(dataUri);
  };

  const submit = async () => {
    const result = await CovidPassportService.createProfile(photo, name);
    if (!result) {
      setName("");
      setPhoto("");
    }
  };
  // card animation
 const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
 setTimeout(function() {
   setCardAnimation("");
 }, 700);
 const useStyles = makeStyles(styles);
 const classes = useStyles();
return(
    <div
    className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + "/bg7.jpg" + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
          height:"100vh",
          margin:"0px 0"
          
        }}
    >
    <div className={classes.container} >
      <Typography variant="h3" className="centerText" style={{margin:"25px"}}>
        Covid Passport
      </Typography>
      <Card style={{padding:"20px", backgroundColor:"rgba(0,0,0,1)"}}>
        <CardHeader title="Add Profile of a Family Member" />
        <CardContent>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            margin="normal"
            id="name"
            label="Name of Person"
            variant="outlined"
            color="primary"
            autoFocus="true"
            style={{
              color:"#fff"
            }}
          />

          {photo ? (
            <img style={{ width: "100%", padding:"20px" }} src={photo}></img>
          ) : (
            <Camera sizeFactor={0.5} style={{ width: "100%", margin:"20px", padding:"20px" }} onTakePhoto={takePhoto} />
          )}
        </CardContent>
        <CardActions>
          <Link href="/dashboard">
            <Button onClick={() => {}} variant="contained" color="default">
              Back
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button onClick={submit} variant="contained" color="primary">
              Send
            </Button>
          </Link>
        </CardActions>
      </Card>
      <style jsx global>{`
        .centerText {
          text-align: center;
        }
      `}</style>

    </div>
    </div>
  );
}
