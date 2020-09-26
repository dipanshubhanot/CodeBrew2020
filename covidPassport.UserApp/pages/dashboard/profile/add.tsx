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

          {photo ? (
            <img style={{ width: "100%" }} src={photo}></img>
          ) : (
            <Camera sizeFactor={0.5} onTakePhoto={takePhoto} />
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
