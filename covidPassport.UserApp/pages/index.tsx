import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
// import Box from "@material-ui/core/Box";
// import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import * as firebase from "firebase";
import dynamic from "next/dynamic";
import CovidPassportService from "../services/CovidPassportService";
import { useRouter } from "next/router";


import div from "@material-ui/core/Container";
import Typograhy from "@material-ui/core/Typography";
import Link from "next/link";
// import Copyright from "../src/Copyright";

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

const StyledFirebaseAuth = dynamic(
  () => import("react-firebaseui/StyledFirebaseAuth"),
  {
    ssr: false,
  }
);
import styles from "../src/assets/jss/material-kit-react/views/loginPage.js";

const useStyles = makeStyles(styles);


export default function Index(props: any) {
  const [uid, setUid] = React.useState("");

  // card animation
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function() {
    setCardAnimation("");
  }, 700);

  const classes = useStyles();
  const { ...rest } = props;

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    // signInSuccessUrl: "/dashboard",
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccess: (currentUser: any) => {
        console.log(currentUser);
        setUid(currentUser.uid);
        CovidPassportService.login(currentUser.uid);
        useRouter().push("/dashboard");
      },
    },
  };

  // // Terms of service url.
  // tosUrl: '<your-tos-url>',
  // // Privacy policy url.
  // privacyPolicyUrl: '<your-privacy-policy-url>'

  var firebaseConfig = {
    apiKey: "AIzaSyBHVA72kfKEln5gg4fENfg0EV8UvGtgP_M",
    authDomain: "codebrew2020.firebaseapp.com",
    databaseURL: "https://codebrew2020.firebaseio.com",
    projectId: "codebrew2020",
    storageBucket: "codebrew2020.appspot.com",
    messagingSenderId: "587209520782",
    appId: "1:587209520782:web:29e8bcaa080072ce75bbdf",
    measurementId: "G-4MQ7ZD83ZD",
  };

  React.useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    const user = firebase.auth().currentUser;

    const login = async (user: any) => {
      await CovidPassportService.login(user.uid);
      useRouter().push("/dashboard");
    };

    if (user) {
      login(user);
    }
    console.log(firebase.auth().currentUser);
  }, []);

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const user = firebase.auth().currentUser;

  const login = async (user: any) => {
    // await CovidPassportService.login(user.uid);
    useRouter().push("/dashboard");
  };

  if (user) {
    login(user);
  }
  console.log(firebase.auth().currentUser);

  return (
    <div>
      {/* <Header
        absolute
        color="transparent"
        brand="COVID PASSPORT"
        // {...rest}
      /> */}
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + "/bg7.jpg" + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridItem>
          
            <Container maxWidth="sm">
              <Typography variant="h2" className="centerText" style={{margin:"50px"}}>
                Covid Passport
              </Typography>
              {firebase.apps.length ? (
                <StyledFirebaseAuth
                  uiConfig={uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              ) : null}
              <style jsx global>{`
                .centerText {
                  text-align: center;
                }
              `}</style>

              </Container>
            </GridItem>
          </div>
      </div>
    </div>
  );
}

const oldLogin = () => {
  const login = () => {
    firebase.auth().signInWithEmailAndPassword(email, password);
  };
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <Card>
      <CardHeader title="Login" />
      <CardContent>
        <TextField
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          margin="normal"
          id="email"
          label="Email"
          variant="outlined"
        />
        <TextField
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          id="password"
          type="password"
          label="Password"
          variant="outlined"
        />
      </CardContent>
      <CardActions>
        {/* <Link href="/dashboard"> */}
        <Button onClick={login} variant="contained" color="primary">
          Login
        </Button>
        {/* </Link> */}
        <Link href="/register">
          <Button variant="contained" color="primary">
            Sign Up
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
};
