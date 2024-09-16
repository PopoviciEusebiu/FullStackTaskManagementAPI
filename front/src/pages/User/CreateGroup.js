import React from 'react';
import withRouter from "../../utils/withRouter";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Alert
} from '@mui/material';
import axiosInstance from "../../axios";
import {jwtDecode} from "jwt-decode";

class CreateGroup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            user: null,
            isOpen: true,
            createGroupSuccess: false,
            errorMessage: null
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.onSubmitFunction = this.onSubmitFunction.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            this.setState({ user: decoded });
        } else {
            this.setState({ errorMessage: "No token found, please log in." });
        }
    }

    handleClose() {
        this.setState({ isOpen: false });
        this.props.navigate('/groups');
    }

    handleInput(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    onSubmitFunction(event) {
        event.preventDefault();

        const { name, description, user } = this.state;
        if (!user || !user.username) {
            this.setState({ errorMessage: "User data is missing" });
            return;
        }

        const group = {
            name,
            description
        };

        const token = localStorage.getItem('jwtToken');
        const authHeaders = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axiosInstance.post("/group", group, authHeaders)
            .then(res => {
                this.setState({ createGroupSuccess: true, errorMessage: null });
            })
            .catch(error => {
                console.error("Error creating group:", error);
                this.setState({ errorMessage: "Creation failed. Please try again." });
            });
    }

    render() {
        const { isOpen, name, description, createGroupSuccess, errorMessage } = this.state;

        return (
            <Dialog open={isOpen} onClose={this.handleClose}>
                <DialogTitle>Create New Group</DialogTitle>
                <DialogContent>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <form onSubmit={this.onSubmitFunction}>
                        <TextField
                            label="Name"
                            name="name"
                            fullWidth
                            value={name}
                            onChange={this.handleInput}
                            required
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            label="Description"
                            name="description"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={this.handleInput}
                            required
                            sx={{ marginTop: 2 }}
                        />
                        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                            Create Group
                        </Button>
                        {createGroupSuccess && (
                            <Alert severity="success" style={{ marginTop: 20 }}>
                                Group successfully created!
                            </Alert>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withRouter(CreateGroup);
