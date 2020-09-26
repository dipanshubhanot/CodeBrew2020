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
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";

function createData(id: string, type: string, date: string, result: string) {
  return { id, date, type, result };
}

const rows = [
  createData(
    "123sdjvweoirufsdoivjeoijt",
    "Covid vaccine",
    "2020/09/26",
    "Active"
  ),
  createData(
    "123sdjvweoirufsdoivjeoijt",
    "Covid test",
    "2020/09/25",
    "Pending"
  ),
  createData(
    "123sdjvweoirufsdoivjeoijt",
    "Covid test",
    "2020/09/03",
    "Negative"
  ),
  createData(
    "123sdjvweoirufsdoivjeoijt",
    "Covid test",
    "2020/08/20",
    "Positive"
  ),
  createData(
    "123sdjvweoirufsdoivjeoijt",
    "Covid test",
    "2020/08/03",
    "Negative"
  ),
  createData(
    "123sdjvweoirufsdoivjeoijt",
    "Covid test",
    "2020/07/22",
    "Negative"
  ),
];

const profiles = ["Profile 1", "Child 1", "Child 2"];

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
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedProfile, setSelectedProfile] = React.useState(profiles[0]);

  const getChipColorStyle = (status: string) => {
    switch (status) {
      case "Active":
      case "Negative":
        return "background-green";
      case "Positive":
        return "background-red";
      default:
        return "background-blue";
    }
  };

  return (
    <Container maxWidth="sm">
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={() => {
          setOpen(true);
        }}
        edge="start"
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
          {profiles.map((text, index) => (
            <ListItem
              onClick={() => {
                setSelectedProfile(text);
              }}
              button
              key={text}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
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
        </List>
      </Drawer>
      <Typography variant="h2" className="centerText">
        Results for {selectedProfile}
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Type</StyledTableCell>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell align="right">Result</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <Link href={`/dashboard/qrcode/${row.id}`}>
                <StyledTableRow key={row.type}>
                  <StyledTableCell component="th" scope="row">
                    {row.type}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {row.date}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <Chip
                      className={getChipColorStyle(row.result)}
                      label={row.result}
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
