import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../axios";
import {Alert, Dialog, DialogContent, DialogTitle, MenuItem, Select} from "@mui/material";
import withRouter from "../../utils/withRouter";

class UpdateTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props.params.id,
            title: "",
            description: "",
            status: "",
            dueDate: "",
            updateSuccess: false,
            errorMessage: "",
            isOpen: true
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.onSubmitFunction = this.onSubmitFunction.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.authenticatedAxios().get(`/task/${this.state.id}`)
            .then(response => {
                const {title, description, status, dueDate} = response.data;
                this.setState({title, description, status, dueDate});
            })
            .catch(error => {
                console.error("Failed to fetch task data:", error);
                this.setState({errorMessage: "Failed to fetch task details."});
            });
    }

    handleInput(event) {
        const {name, value} = event.target;
        this.setState({
            [name]: value
        });
    }

    handleStatusChange(event) {
        this.setState({
            status: event.target.value
        });
    }

    handleDateChange(event) {
        this.setState({
            dueDate: event.target.value
        });
    }

    handleClose() {
        this.setState({isOpen: false});
        this.props.navigate("/tasks");
    }

    onSubmitFunction(event) {
        event.preventDefault();

        const {title, description, status, dueDate} = this.state;

        const updatedTask = {
            title,
            description,
            status,
            dueDate
        };

        this.authenticatedAxios().put(`/task/${this.state.id}`, updatedTask)
            .then(() => {
                this.setState({
                    updateSuccess: true,
                    errorMessage: ""
                });
            })
            .catch(error => {
                console.error("Update Failed: ", error);
                this.setState({
                    errorMessage: "Update failed. Please try again.",
                    updateSuccess: false
                });
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
        const {title, description, status, dueDate, errorMessage, updateSuccess, isOpen} = this.state;

        return (
            <Dialog open={isOpen} onClose={this.handleClose}>
                <DialogTitle>Update Task</DialogTitle>
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
                            sx={{marginTop: 2}}
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
                            sx={{marginTop: 2}}
                        />
                        <TextField
                            label="Due Date"
                            type="date"
                            name="dueDate"
                            fullWidth
                            value={dueDate}
                            onChange={this.handleDateChange}
                            sx={{marginTop: 2}}
                        />
                        <Select
                            fullWidth
                            value={status}
                            onChange={this.handleStatusChange}
                            sx={{marginTop: 2}}
                        >
                            <MenuItem value="TODO">TODO</MenuItem>
                            <MenuItem value="Completed">DONE</MenuItem>
                        </Select>
                        <Button type="submit" variant="contained" color="primary" sx={{marginTop: 2}}>
                            Update Task
                        </Button>
                        {updateSuccess && (
                            <Alert severity="success" style={{marginTop: 20}}>
                                Task successfully updated!
                            </Alert>
                        )}
                        {errorMessage && (
                            <Alert severity="error" style={{marginTop: 20}}>
                                {errorMessage}
                            </Alert>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default withRouter(UpdateTask);
