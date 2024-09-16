import React from 'react';
import { Button, TextField, Container, Grid, Typography, Select, MenuItem, FormControl, InputLabel, Alert } from '@mui/material';
import axiosInstance from "../../axios";
import Navbar from "../../utils/Navbar";

class CreateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            username: "",
            emailAddress: "",
            password: "",
            registerSuccess: false,
            errorMessage: ""
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.onSubmitFunction = this.onSubmitFunction.bind(this);
    }

    handleInput(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    handleSelectChange(event) {
        this.setState({
            role: event.target.value
        });
    }

    onSubmitFunction(event) {
        event.preventDefault();
        const { firstName, lastName, username, emailAddress, password} = this.state;

        let user = {
            firstName,
            lastName,
            username,
            emailAddress,
            password
        };

        this.authenticatedAxios().post("/register", user)
            .then(res => {
                this.setState({registerSuccess: true});

                    console.log("User created with success!");})
            .catch(error => {
                console.log("Creation failed: ", error);
                this.setState({ errorMessage: "Creation failed. Please try again." });
            });
    }

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    render() {
        return (
            <>
                <Navbar />
            <Container maxWidth="sm">
                <div style={{paddingTop: '60px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                Create User
                            </Typography>
                            <form onSubmit={this.onSubmitFunction}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    name="firstName"
                                    autoComplete="given-name"
                                    value={this.state.firstName}
                                    onChange={this.handleInput}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    value={this.state.lastName}
                                    onChange={this.handleInput}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    value={this.state.username}
                                    onChange={this.handleInput}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="emailAddress"
                                    label="Email Address"
                                    name="emailAddress"
                                    type="email"
                                    autoComplete="email"
                                    value={this.state.emailAddress}
                                    onChange={this.handleInput}
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={this.state.password}
                                    onChange={this.handleInput}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Create User
                                </Button>
                            </form>
                            {this.state.registerSuccess && (
                                <Alert severity="success" style={{ marginTop: 20 }}>
                                    Creation successful!
                                </Alert>
                            )}
                            {this.state.errorMessage && (
                                <Alert severity="error" style={{ marginTop: 20 }}>
                                    {this.state.errorMessage}
                                </Alert>
                            )}
                        </Grid>
                    </Grid>
                </div>
            </Container>
            </>
        );
    }
}

export default CreateUser;
