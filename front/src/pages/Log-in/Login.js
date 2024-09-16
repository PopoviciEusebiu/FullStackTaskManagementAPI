import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import axiosInstance from "../../axios";
import Grid from "@mui/material/Grid";
import history from '../../history';
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import {Alert} from "@mui/material";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errorMessage: ""
        };
    }

    handleInput = event => {
        const {value, name} = event.target;
        this.setState({
            [name]: value
        });
    };

    onSubmitFunction = event => {
        event.preventDefault();
        const { username, password } = this.state;

        axiosInstance.post("/login", { username, password })
            .then(res => {
                const { token } = res.data;
                if (token) {
                    localStorage.setItem("jwtToken", token);
                    const decodedToken = jwtDecode(token);
                    const roles = decodedToken.roles;
                    if (roles && roles.length > 0) {
                        this.redirectUser(roles[0]);
                    } else {
                        this.setState({ errorMessage: "Account does not have any roles assigned or token format is incorrect." });
                    }
                } else {
                    this.setState({ errorMessage: "Login successful but no token received, contact support." });
                }
            })
            .catch(error => {
                let message = "Login failed due to server error."; // Default message
                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 400 || status === 401) {
                        message = data && data.message ? data.message : "Invalid username or password.";
                    } else if (status === 403) {
                        message = "Cannot login, please verify your email.";
                    } else if (status === 404) {
                        message = "User not found.";
                    }
                } else {
                    message = "Network error or server not responding.";
                }
                this.setState({ errorMessage: message });
            });
    }



    redirectUser(role) {
        switch (role) {
            case "ADMIN":
                history.push("/profile");
                break;
            case "USER":
                history.push("/userHome");
                break;
            default:
                history.push("/login");
                break;
        }
        window.location.reload();
    }

    render() {
        return (
            <Container maxWidth="sm">
                <div style={{paddingTop: '160px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <form onSubmit={this.onSubmitFunction}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                    onChange={this.handleInput}
                                    autoFocus
                                />
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="password"
                                    label="Password"
                                    type="password"
                                    name="password"
                                    onChange={this.handleInput}
                                    autoComplete="current-password"
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign In
                                </Button>
                                {this.state.errorMessage && (
                                    <Alert severity="error" style={{marginTop: 20}}>
                                        {this.state.errorMessage}
                                    </Alert>
                                )}
                            </form>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">
                            You don't have an account?
                        </Typography>
                        <Link to="/register" style={{textDecoration: 'dashed'}}>
                            <Typography variant="body2" style={{cursor: 'pointer'}}>
                                Register
                            </Typography>
                        </Link>
                    </Grid>
                </div>
            </Container>
        );
    }
}

export default Login;
