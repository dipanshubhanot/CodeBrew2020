import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ProTip from "../src/ProTip";
import Link from "next/link";
import Copyright from "../src/Copyright";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import TextField from "@material-ui/core/TextField";
import * as firebase from "firebase";

export default function Index() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const register = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBHVA72kfKEln5gg4fENfg0EV8UvGtgP_M",
        authDomain: "codebrew2020.firebaseapp.com",
        databaseURL: "https://codebrew2020.firebaseio.com",
        projectId: "codebrew2020",
        storageBucket: "codebrew2020.appspot.com",
        messagingSenderId: "587209520782",
        appId: "1:587209520782:web:29e8bcaa080072ce75bbdf",
        measurementId: "G-4MQ7ZD83ZD",
      });

      firebase.auth().createUserWithEmailAndPassword(email, password);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" className="centerText">
        Covid Passport
      </Typography>
      <Card>
        <CardHeader title="Register" />
        <CardContent>
          <TextField
            value={email}
            onChange={(e) => {
              setEmail(e.currentTarget.value);
            }}
            fullWidth
            margin="normal"
            id="outlined-basic"
            label="Email"
            variant="outlined"
          />
          <TextField
            fullWidth
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
            type="password"
            margin="normal"
            id="password"
            label="Password"
            variant="outlined"
          />
          <TextField
            fullWidth
            type="password"
            margin="normal"
            id="repeat-password"
            label="Repeat Password"
            variant="outlined"
          />
        </CardContent>
        <CardActions>
          <Link href="/">
            <Button variant="contained" color="default">
              Back
            </Button>
          </Link>
          <Button variant="contained" color="primary" onClick={register}>
            Send
          </Button>
        </CardActions>
      </Card>
      <style jsx global>{`
        .centerText {
          text-align: center;
        }
      `}</style>
      {/* <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />
      </Box> */}
    </Container>
  );
}
