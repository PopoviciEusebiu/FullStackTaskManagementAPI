import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axiosInstance from "../../axios";
import {Alert, TableCell} from "@mui/material";
import withRouter from '../../utils/withRouter';
import Navbar from "../../utils/Navbar";

class UpdateUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.params.id,
            firstName: "",
            lastName: "",
            username: "",
            emailAddress: "",
            updateSuccess: false,
            errorMessage: ""
        };
        this.handleInput = this.handleInput.bind(this);
        this.onSubmitFunction = this.onSubmitFunction.bind(this);
    }

    componentDidMount() {
        axiosInstance.get(`/user/${this.state.id}`)
            .then(response => {
                const { firstName, lastName, username, emailAddress } = response.data;
                this.setState({ firstName, lastName, username, emailAddress });
            })
            .catch(error => {
                console.error("Failed to fetch user data:", error);
                this.setState({ errorMessage: "Failed to fetch user details." });
            });
    }

    handleInput(event) {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmitFunction(event) {
        event.preventDefault();

        const { firstName, lastName, username, emailAddress } = this.state;

        let user = {
            firstName,
            lastName,
            username,
            emailAddress
        };

        this.authenticatedAxios().put(`/user/${this.state.id}`, user)
            .then(res => {
                this.setState({ updateSuccess: true });
                setTimeout(() => {
                    console.log("Update Success");
                    this.props.navigate("/find");
                }, 3000);
            })
            .catch(error => {
                console.log("Update Failed: ", error);
                this.setState({ errorMessage: "Update failed. Please try again." });
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
                <div style={{ paddingTop: '120px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5">
                                Update User
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Update
                                </Button>
                                {this.state.updateSuccess && (
                                    <Alert severity="success" style={{ marginTop: 20 }}>
                                        User updated successfully!
                                    </Alert>
                                )}
                                {this.state.errorMessage && (
                                    <Alert severity="error" style={{ marginTop: 20 }}>
                                        {this.state.errorMessage}
                                    </Alert>
                                )}
                            </form>
                        </Grid>
                    </Grid>
                </div>
            </Container>
            </>
        );
    }
}

export default withRouter(UpdateUser);

