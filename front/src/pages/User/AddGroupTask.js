import React, { Component } from 'react';
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
import axiosInstance from '../../axios';
import {jwtDecode} from 'jwt-decode';

class AddGroupTask extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            status: 'TODO',
            dueDate: new Date().toISOString().slice(0, 10),
            user: null,
            errorMessage: null
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            this.setState({
                user: decoded,
            });
        } else {
            this.setState({ errorMessage: "No token found, please log in." });
        }
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleDateChange = (event) => {
        const newDate = new Date(event.target.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (newDate >= today) {
            this.setState({ dueDate: newDate.toISOString().slice(0, 10) });
        } else {
            console.warn("Selected date is in the past");
            this.setState({ errorMessage: "Cannot select a past date." });
        }
    };

    handleAddTaskSubmit = (event) => {
        event.preventDefault();
        const { title, description, status, dueDate, user } = this.state;
        const { groupId } = this.props;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(dueDate) < today) {
            this.setState({ errorMessage: "Cannot save a task with a past date." });
            return;
        }


        const newTask = {
            title,
            description,
            status,
            dueDate,
            users: [{ username: user.username }]
        };

        const token = localStorage.getItem('jwtToken');
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axiosInstance.post(`/group/${groupId}/task`, newTask)
            .then(response => {
                this.props.refreshTasks();
                this.props.onClose();
                this.setState({
                    title: '',
                    description: '',
                    status: 'TODO',
                    dueDate: new Date().toISOString().slice(0, 10),
                    errorMessage: null
                });
            })
            .catch(error => {
                console.error('Error adding task:', error);
                this.setState({ errorMessage: 'Failed to add task.' });
            });
    };

    render() {
        const { isOpen, onClose } = this.props; // Destructure props to get isOpen and onClose
        const { title, description, status, dueDate, errorMessage } = this.state;

        return (
            <Dialog open={isOpen} onClose={onClose}> {/* Use isOpen prop */}
                <DialogTitle>Add Task</DialogTitle>
                <DialogContent>
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <form onSubmit={this.handleAddTaskSubmit}>
                        <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            value={title}
                            onChange={this.handleInputChange}
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
                            onChange={this.handleInputChange}
                            required
                            sx={{ marginTop: 2 }}
                        />
                        <TextField
                            label="Due Date"
                            type="date"
                            name="dueDate"
                            fullWidth
                            value={dueDate}
                            onChange={this.handleDateChange}
                            min={new Date().toISOString().slice(0, 10)}
                            sx={{ marginTop: 2 }}
                        />
                        <Select
                            fullWidth
                            name="status"
                            value={status}
                            onChange={this.handleInputChange}
                            sx={{ marginTop: 2 }}
                        >
                            <MenuItem value="TODO">TODO</MenuItem>
                            <MenuItem value="DONE">DONE</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
                            Save Task
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default AddGroupTask;
