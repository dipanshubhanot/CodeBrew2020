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
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

export default function Appointment() {
  const [type, setType] = React.useState("");

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" className="centerText">
        Covid Passport
      </Typography>
      <Card>
        <CardHeader title="Add Appointment" />
        <CardContent>
          <InputLabel id="demo-simple-select-label">
            Appointment type
          </InputLabel>
          <Select
            fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={type}
            onChange={(e: any) => {
              setType(e.target.value);
            }}
          >
            <MenuItem value={"covid-test"}>Covid Test</MenuItem>
            <MenuItem value={"covid-vaccine"}>Covid Vaccine</MenuItem>
          </Select>
        </CardContent>
        <CardActions>
          <Link href="/dashboard">
            <Button variant="contained" color="default">
              Back
            </Button>
          </Link>
          <Button variant="contained" color="primary" onClick={() => {}}>
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
