import React, { useEffect, useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
import Card from "@material-ui/core/Card";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import { FormControl } from "@material-ui/core";
import CovidPassportService from "../../services/CovidPassportService";
import { useRouter } from "next/router";

export default function Appointment() {
  const router = useRouter();
  const [type, setType] = useState("");
  const [profile, setProfile] = useState("");
  const [profiles, setProfiles] = useState<any[]>([]);
  const [] = useState<boolean>(false);

  useEffect(() => {
    const getProfiles = async () => {
      const profiles = await CovidPassportService.getProfiles();
      console.log(profiles);
      setProfiles(profiles);
    };

    getProfiles();
  }, []);

  const send = async () => {
    await CovidPassportService.addAppointment(
      profiles.find((currProfile) => currProfile.id === profile),
      type
    );
    router.push("/dashboard");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" className="centerText">
        Covid Passport
      </Typography>
      <Card>
        <CardHeader title="Add Appointment" />
        <CardContent>
          <FormControl fullWidth>
            <InputLabel id="profile">Profile</InputLabel>
            <Select
              fullWidth
              labelId="profile"
              id="demo-simple-select"
              value={profile}
              onChange={(e: any) => {
                console.log(e.target.value);
                setProfile(e.target.value);
              }}
            >
              {profiles.map((profile) => (
                <MenuItem value={profile.id}>{profile.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
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
              <MenuItem value={"Covid test"}>Covid Test</MenuItem>
              <MenuItem value={"Covid vaccine"}>Covid Vaccine</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
        <CardActions>
          <Link href="/dashboard">
            <Button variant="contained" color="default">
              Back
            </Button>
          </Link>
          <Button onClick={send} variant="contained" color="primary">
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
