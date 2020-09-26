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
import axios from "axios";



function createData(id: string, name: string, date: string, apptDate: string, type: string, status: string) {
    return { id, name, date, apptDate,type,status };
}
const rows = [
    createData(
        "123sdjvweoirufsdoivjeoijt",
        "Harry",
        "2020/09/23",
        "2020/09/26 15:40",
        "Covid vaccine",
        "pending"
    ),
    createData(
        "123sdjvweoirufsdoivjeoijt",
        "Lin",
        "2020/09/23",
        "2020/09/25 12:20",
        "Covid test",
        "completed"
    ),
    createData(
        "123sdjvweoirufsdoivjeoijt",
        "Dan",
        "2020/09/23",
        "2020/09/03 15:40",
        "Covid vaccine",
        "completed"
    ),
    createData(
        "123sdjvweoirufsdoivjeoijt",
        "Clare",
        "2020/09/23",
        "2020/08/20 21:30",
        "Covid test",
        "pending"
    ),

];

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



export default function Log() {

    const [selectedResult, setselectedResult] = useState("name")
    const [selectedQuery, setselectedQuery] = useState("")
    const handleChange = (event) => {
        setselectedResult(event.target.value);
    };
    const handleSearchChange = (event) => {
        setselectedQuery(event.target.value);
    };



    const router = useRouter();
    const handleSearchClick = (AID ,Name, Date, Type, Status, Image, profileID) => {

        router.push({
            pathname: '/dashboard/${row.id}',
            query: {date:AID ,name: Name ,aptDate: Date, type: Type, status: Status,  image: Image,profile: profileID }//
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
        makeGetRequest('http://localhost:8080/appointment?requirement=everything');
    }, [])



    return (
        <Container maxWidth="sm">

            <Typography variant="h2" className="centerText">
                Covid Tracker
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
                                    return currentRow.apptDate.includes(selectedQuery)
                                }


                        }).map((row,i) => (
                            //<Link href={`/dashboard/${row.id}`}>
                            <StyledTableRow key={i} onClick={()=>{handleSearchClick(row.date,row.name,row.aptDate,row.type,row.status,row.image,row.id)}}>
                                <StyledTableCell component="th" scope="row">
                                    {row.name}
                                </StyledTableCell>
                                <StyledTableCell component="th" scope="row">
                                    {row.apptDate}
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
