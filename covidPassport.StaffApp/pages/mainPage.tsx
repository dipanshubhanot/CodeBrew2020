import React, {useState} from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import TableBody from "@material-ui/core/TableBody";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import {useRouter} from "next/router";
import {Box} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import axios from "axios";



//Table Styles
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


export default function MainPage() {


    // const getChipColorStyle = (status: string) => {
    //     switch (status) {
    //         case "Active":
    //         case "Negative":
    //             return "background-green";
    //         case "Positive":
    //             return "background-red";
    //         default:
    //             return "background-blue";
    //     }
    // };


    const [selectedResult, setselectedResult] = useState("name")
    const [selectedQuery, setselectedQuery] = useState("")
    const handleChange = (event) => {
        setselectedResult(event.target.value);
    };
    const handleSearchChange = (event) => {
        setselectedQuery(event.target.value);
    };



    const router = useRouter();
    const handleSearchClick = ( AID ,Name, Date, Type, Status, Image, profileID) => {

            router.push({
                pathname: '/dashboard/${row.id}',
                query: {date:AID ,name: Name ,aptDate: Date, type: Type, status: Status,  image: Image,profile: profileID}
            });

    };


    const [data, setData] = useState([])
    React.useEffect(() => {
        const makeGetRequest = (path) => {
            axios.get(path).then(
                (response) => {
                    var result = JSON.parse(response.data) ;
                    setData(result) ;
                    console.log(result)

                },
                (error) => {
                    console.log(error);
                }
            );
        }
        makeGetRequest('https://todo-h3gj3loe2q-uc.a.run.app/appointment?requirement=pending');
    }, [])



    return (
        <Container maxWidth="sm">

            <Typography variant="h2" className="centerText">
                Appointment List
            </Typography>



            <TextField
                id="queryID"
                label="Search query"
                value={selectedQuery}
                onChange = {handleSearchChange} />

            <Select
                labelId="resultID"
                id="resultID-select"
                value={selectedResult}
                onChange={handleChange}
            >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="date">Date</MenuItem>
            </Select>

            <Box component="span" m={50}>
                <Link href="/log">
                <Button variant="contained" color="primary">
                    Check Log
                </Button>
                </Link>
            </Box>


            <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Date&Time</StyledTableCell>
                            <StyledTableCell align="right">Type</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.filter( (currentRow) => {
                                if (selectedResult == "name") {
                                    return currentRow.name.toUpperCase().includes(selectedQuery.toUpperCase())

                                } else if(selectedResult == "date"){
                                    return currentRow.aptDate.includes(selectedQuery)
                                }
                        }).map((row,i) => (
                            //<Link href={`/dashboard/${row.id}`}>
                                <StyledTableRow key={i} onClick={()=>{handleSearchClick(row.date,row.name,row.aptDate,row.type,row.status,row.image,row.id)}}>
                                    <StyledTableCell component="th" scope="row">
                                        {row.name}
                                    </StyledTableCell>
                                    <StyledTableCell component="th" scope="row">
                                        {row.aptDate}
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Chip
                                            // className={getChipColorStyle(row.result)}
                                            label={row.type}
                                        />
                                    </StyledTableCell>
                                </StyledTableRow>
                            //</Link>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <style jsx global>{`
        .centerText {
          text-align: center;
        }
        div .background-red {
          background-color: #F44336;
          color: white;
        }
        div .background-green {
          background-color: #4CAF50;
          color: white;
        }
        div .background-blue {
          background-color: #2196F3;
          color: white;
        }
      `}</style>
        </Container>
    );
}
