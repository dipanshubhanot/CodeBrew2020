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

export default function Index(props: any) {
  const [name, setName] = React.useState("");

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" className="centerText">
        Covid Passport
      </Typography>
      <Card>
        <CardHeader title="Add Profile" />
        <CardContent>
          <TextField
            fullWidth
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            margin="normal"
            id="name"
            label="Name"
            variant="outlined"
          />
        </CardContent>
        <CardActions>
          <Link href="/dashboard">
            <Button onClick={() => {}} variant="contained" color="default">
              Back
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="contained" color="primary">
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
