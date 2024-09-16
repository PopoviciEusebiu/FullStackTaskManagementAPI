import React from 'react';
import withRouter from "../../utils/withRouter";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Select,
    MenuItem,
    Button,
    Alert
} from '@mui/material';
import axiosInstance from "../../axios";
import {jwtDecode} from "jwt-decode"; // Note: Remove curly braces around jwtDecode

class AddTask extends React.Component {
    constructor(props) {
        super(props);
        const initialDate = localStorage.getItem("initialDate");
        this.state = {
            date: initialDate ? new Date(initialDate) : new Date(),
            title: '',
            description: '',
            status: 'TODO',
            user: null,
            isOpen: true,
            addTaskSuccess: false,
            errorMessage: null
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onSubmitFunction = this.onSubmitFunction.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                this.setState({ user: decoded });
            } catch (error) {
                console.error("Invalid token:", error);
                this.setState({ errorMessage: "Invalid token. Please log in again." });
            }
        }

        const initialDate = localStorage.getItem("initialDate");
        if (initialDate) {
            const date = new Date(initialDate);
            this.setState({ date });
        }
    }

    handleClose() {
        this.setState({ isOpen: false });
        this.props.navigate('/userHome');
    }

    handleInput(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleStatusChange(event) {
        this.setState({ status: event.target.value });
    }

    handleDateChange(event) {
        const newDate = new Date(event.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalizează ora pentru comparare doar pe baza datei

        if (newDate >= today) {
            const justDate = newDate.toISOString().slice(0, 10);
            localStorage.setItem("initialDate", justDate);
            this.setState({ date: newDate });
        } else {
            console.warn("Selected date is in the past");
            this.setState({ errorMessage: "Cannot select a past date." });
        }
    }

    onSubmitFunction(event) {
        event.preventDefault();

        const { title, description, date, status, user } = this.state;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) {
            this.setState({ errorMessage: "Cannot save a task with a past date." });
            return;
        }

        if (!user || !user.username) {
            this.setState({ errorMessage: "User data is missing" });
            return;
        }

        const task = {
            title,
            description,
            status,
            dueDate: date.toISOString().slice(0, 10), // Ensure the date is in the correct format
            users: [
                {
                    username: user.username,
                },
            ],
        };

        const token = localStorage.getItem('jwtToken');
        const authHeaders = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        axiosInstance.post("/task", task, authHeaders)
            .then(res => {
                this.setState({ addTaskSuccess: true, errorMessage: null });
            })
            .catch(error => {
                console.error("Error creating task:", error);
                const errorMessage = error.response?.status === 401
                    ? "Unauthorized. Please log in again."
                    : "Creation failed. Please try again.";
                this.setState({ errorMessage });
            });
    }

    render() {
        const { isOpen, date, title, description, status, errorMessage } = this.state;

        return (
            <Dialog open={isOpen} onClose={this.handleClose}>
                <DialogTitle>Add Task for the date: {date.toDateString()}</DialogTitle>
                <DialogContent>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <form onSubmit={this.onSubmitFunction}>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            value={title}
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
                        <TextField
                            label="Due Date"
                            type="date"
                            name="dueDate"
                            fullWidth
                            value={this.state.date.toISOString().slice(0, 10)}
                            onChange={this.handleDateChange}
                            min={new Date().toISOString().slice(0, 10)}
                            sx={{ marginTop: 2 }}
                        />
                        <Select
                            fullWidth
                            value={status}
                            onChange={this.handleStatusChange}
                            sx={{ marginTop: 2 }}
                        >
                            <MenuItem value="TODO">TODO</MenuItem>
                            <MenuItem value="DONE">DONE</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                            Save Task
                        </Button>
                        {this.state.addTaskSuccess && (
                            <Alert severity="success" style={{ marginTop: 20 }}>
                                Task successfully added!
                            </Alert>
                        )}
                        {this.state.errorMessage && (
                            <Alert severity="error" style={{ marginTop: 20 }}>
                                {this.state.errorMessage}
                            </Alert>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withRouter(AddTask);
