import {Container} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";


export default function Index() {


    return (
        <Container maxWidth="sm">
            <Card>
                <CardHeader title="Index" />
                <CardContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Email"
                        variant="outlined"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        id="outlined-basic"
                        label="Password"
                        variant="outlined"
                    />
                </CardContent>
                <CardActions>
                    <Link href="/mainPage">
                    <Button variant="contained" color="primary">
                        Log In
                    </Button>
                    </Link>
                    <Button variant="contained" color="primary">
                        Sign Up
                    </Button>
                </CardActions>
            </Card>

        </Container>
    );
}
