import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import QRCode from "qrcode.react";
import { useRouter } from "next/router";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import dynamic from "next/dynamic";
import CancelIcon from "@material-ui/icons/Cancel";
import CovidPassportService from "../../services/CovidPassportService";
import Button from "@material-ui/core/Button";
const QrReader = dynamic(() => import("react-qr-reader"), {
  ssr: false,
});


import Header from "../../src/components/Header/Header.js";
import Footer from "../../src/components/Footer/Footer.js";
import GridContainer from "../../src/components/Grid/GridContainer.js";
import GridItem from "../../src/components/Grid/GridItem.js";
// import Button from "../../../src/components/CustomButtons/Button.js";
import HeaderLinks from "../../src/components/Header/HeaderLinks.js";
import Parallax from "../../src/components/Parallax/Parallax.js";
import styles from "../../src/assets/jss/material-kit-react/views/landingPage.js";

import { makeStyles, withStyles } from "@material-ui/core/styles";

export default function Index() {
  const router = useRouter();
  const [data, setData] = React.useState();
  const [result, setResult] = React.useState();

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
          margin:"0px 0"
          
        }}
    >
    <Container maxWidth="sm">
    <Typography variant="h2" className="centerText" style={{margin:"0px", color:"#fff", padding:"30px"}}>
        Covid Passport
      </Typography>
      <Typography variant="h4" className="centerText" style={{margin:"0px", color:"#fff", padding:"30px"}}>
        Validate Result
      </Typography>
      {!data && (
        <QrReader
          delay={300}
          facingMode="environment"
          onError={(err) => {
            console.log(err);
          }}
          onScan={async (scan: any) => {
            if (scan) {
              setData(scan as any);
              const response = await CovidPassportService.verifyScan(scan);
              console.log(response);
              setResult(response as any);
            }
            console.log(scan);
          }}
          style={{ width: "100%" }}
        />
      )}
      {result && (
        <React.Fragment>
          <img className="img" src={result.image} />{" "}
          {result.status !== "pending" && result.status !== "positive" ? (
            <CheckCircleIcon
              style={{ fontSize: "8em" }}
              fontSize="large"
              className={"check"}
            />
          ) : (
            <CancelIcon
              style={{ fontSize: "8em" }}
              fontSize="large"
              className={"cancel"}
            />
          )}
          <Typography variant="h4" className="centerText">
            Result: {result.status}
          </Typography>
          <Button
            style={{ display: "block", margin: "25px auto" }}
            variant="contained"
            color="primary"
            onClick={() => {
              setResult(undefined);
              setData(undefined);
            }}
          >
            Reset
          </Button>
        </React.Fragment>
      )}
      <style jsx global>{`
        .centerText {
          text-align: center;
        }
        .margin-auto {
          margin: 25px auto;
          display: block;
        }
        .img {
          width: 70%;
          margin: 20px auto;
          display: block;
        }
        svg.check {
          display: block;
          color: #4caf50;
          fontsize: 8em;
          margin: auto;
        }
        svg.cancel {
          display: block;
          color: #f44336;
          fontsize: 8em;
          margin: auto;
        }
      `}</style>
    </Container>
    </div>
  );
}
