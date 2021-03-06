import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
// import CardHeader from "@material-ui/core/CardHeader";
// import CardContent from "@material-ui/core/CardContent";
// import Button from "@material-ui/core/Button";
// import CardActions from "@material-ui/core/CardActions";
// import Card from "@material-ui/core/Card";
// import TextField from "@material-ui/core/TextField";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import Chip from "@material-ui/core/Chip";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import CovidPassportService from "../../services/CovidPassportService";
import * as firebase from "firebase";


import { makeStyles } from "@material-ui/core/styles";
import Header from "../../src/components/Header/Header.js";
import Footer from "../../src/components/Footer/Footer.js";
import GridContainer from "../../src/components/Grid/GridContainer.js";
import GridItem from "../../src/components/Grid/GridItem.js";
import Button from "../../src/components/CustomButtons/Button.js";
import HeaderLinks from "../../src/components/Header/HeaderLinks.js";
import Parallax from "../../src/components/Parallax/Parallax.js";
import styles from "../../src/assets/jss/material-kit-react/views/landingPage.js";




const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.info.light,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

export default function Index() {
  const [profiles, setProfiles] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = React.useState<any>(null);
  const [rows, setRows] = React.useState<any[]>([]);

  React.useEffect(() => {
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

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    console.log(firebase.auth().currentUser);
  }, []);

  const getChipColorStyle = (status: string) => {
    switch (status) {
      case "injected":
      case "active":
      case "complete":
      case "negative":
        return "background-green";
      case "positive":
        return "background-red";
      default:
        return "background-blue";
    }
  };

  React.useEffect(() => {
    async function loadProfiles() {
      const data = (await CovidPassportService.getProfiles()) as any;
      console.log(data);
      setProfiles(data || []);
      const selectedProfile = data[0];
      setSelectedProfile(selectedProfile);

      async function loadRows(profileId: string) {
        console.log("Loading rows");
        const appointmentData = (await CovidPassportService.getAppointments(
          profileId
        )) as any;
        console.log(appointmentData);
        setRows(appointmentData);
      }

      if (selectedProfile) {
        loadRows(selectedProfile.id);
      }
    }

    loadProfiles();
  }, []);
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
        <div className={classes.container}>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => {
          setOpen(true);
        }}
        
        className={`menu-button ${open ? "hide" : "nohide"}`}
        style={open ? { display: "none" } : {}}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={"drawer"}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: "drawer-paper",
        }}
      >
        <div className={"drawer-Header"}>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
          >
            <ChevronLeftIcon />
            {/* <ChevronRightIcon /> */}
          </IconButton>
        </div>
        <Divider />
        <List>
          {profiles.map((profile, index) => (
            <ListItem
              onClick={() => {
                async function loadRows(profileId: string) {
                  console.log("Loading rows");
                  const appointmentData = (await CovidPassportService.getAppointments(
                    profileId
                  )) as any;
                  setRows(appointmentData);
                }

                loadRows(profile.id);
                setSelectedProfile(profile);
              }}
              button
              key={index}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={profile.name} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <Link href="/dashboard/appointment">
            <ListItem button key={"Add Appointment"}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Add Appointment "} />
            </ListItem>
          </Link>
          <Link href="/dashboard/profile/add">
            <ListItem button key={"Add Profile"}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Add Profile"} />
            </ListItem>
          </Link>
          <Link href="/dashboard/scan">
            <ListItem button key={"Scan"}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Scan"} />
            </ListItem>
          </Link>
          <Link href="/">
            <ListItem
              onClick={() => firebase.auth().signOut()}
              button
              key={"Logout"}
            >
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={"Logout"} />
            </ListItem>
          </Link>
        </List>
      </Drawer>
      <Typography variant="h2" className="centerText" style={{margin:"50px"}}>
                Covid Passport
              </Typography>
      <Typography variant="h4" className="centerText" style={{margin:'50px'}}>
        Results for {selectedProfile && selectedProfile.name}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row, i) => (
                <Link key={i} href={`/dashboard/qrcode/${row.date}`}>
                  <StyledTableRow key={row.type}>
                    <StyledTableCell component="th" scope="row">
                      {row.type}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.aptDate}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Chip
                        className={getChipColorStyle(row.status)}
                        label={row.status}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                </Link>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <style jsx global>{`
        .centerText {
          text-align: center;
        }
        div .background-red {
          background-color: #f44336;
          color: white;
        }
        div .background-green {
          background-color: #4caf50;
          color: white;
        }
        div .background-blue {
          background-color: #2196f3;
          color: white;
        }
        button .hide {
          display: none;
        }
        .menu-button {
          position: absolute !important;
          left: 25px !important;
        }
      `}</style>

    </div>
      </div>

  );
}
