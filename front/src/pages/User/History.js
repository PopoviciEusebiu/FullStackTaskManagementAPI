import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Container,
    tableCellClasses,
    styled,
    TableSortLabel,
    Select,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Alert,
    Grid
} from '@mui/material';
import NavbarU from "../../utils/NavbarU";
import { TbArrowsSort } from "react-icons/tb";
import axiosInstance from "../../axios";
import {FaPen} from "react-icons/fa";
import Box from "@mui/material/Box";
import {jwtDecode} from "jwt-decode";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

class History extends React.Component {
    state = {
        tasks: [],
        orderBy: '',
        order: 'asc',
        selectedStatus: 'TODO',
        editDialogOpen: false,
        editedTask: {
            id: '',
            title: '',
            description: '',
            status: '',
            dueDate: '',
        },
        updateSuccess: false,
        errorMessage: '',
    };

    componentDidMount() {
        this.fetchTasks(this.state.selectedStatus);
    }

    fetchTasks = (status) => {
        const token = localStorage.getItem('jwtToken');
        const decodedToken = jwtDecode(token);
        const username = decodedToken.username;

        const requestBody = {
            taskStatus: status,
            username: username  // Include the username in the request body
        };

        this.authenticatedAxios().post('/task/history', requestBody)
            .then(response => {
                this.setState({ tasks: response.data });
            })
            .catch(error => {
                console.error('There was an error fetching the tasks:', error);
            });
    }


    handleSort = (property) => {
        const { orderBy, order } = this.state;
        const isAsc = orderBy === property && order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        });
    }

    handleEdit = (task) => {
        this.setState({
            editDialogOpen: true,
            editedTask: task,
        });
    }

    handleEditClose = () => {
        this.setState({
            editDialogOpen: false,
            editedTask: {
                id: '',
                title: '',
                description: '',
                status: '',
                dueDate: '',
            },
            updateSuccess: false,
            errorMessage: '',
        });
    }

    handleEditInput = (event) => {
        const { name, value } = event.target;
        this.setState(prevState => ({
            editedTask: {
                ...prevState.editedTask,
                [name]: value,
            }
        }));
    }

    handleEditSubmit = () => {
        const { id, title, description, status, dueDate } = this.state.editedTask;
        const updatedTask = {
            title, description, status, dueDate,
        };

        this.authenticatedAxios().put(`/task/${id}`, updatedTask)
            .then(() => {
                this.setState({
                    updateSuccess: true,
                    errorMessage: '',
                });
                this.fetchTasks(this.state.selectedStatus); // Re-fetch tasks after update
                this.handleEditClose();
            })
            .catch(error => {
                console.error("Update Failed: ", error);
                this.setState({
                    errorMessage: "Update failed. Please try again.",
                    updateSuccess: false
                });
            });
    }

    handleStatusChange = (event) => {
        const status = event.target.value;
        this.setState({ selectedStatus: status });
        this.fetchTasks(status);
    }

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }



    render() {
        const { tasks, orderBy, order, editDialogOpen, editedTask, updateSuccess, errorMessage, selectedStatus } = this.state;
        const sortedTasks = orderBy
            ? tasks.sort((a, b) => {
                const firstValue = a[orderBy];
                const secondValue = b[orderBy];
                return order === 'asc' ? firstValue.localeCompare(secondValue) : secondValue.localeCompare(firstValue);
            })
            : tasks;

        return (
            <>
                <NavbarU />
                <Container>
                    <Typography variant="h4" style={{ margin: '10px 0' }}>
                        History
                        <Grid container alignItems="center" justifyContent="flex-end" spacing={2}>
                            <Grid item>
                                <Select
                                    value={selectedStatus}
                                    onChange={this.handleStatusChange}
                                    variant="outlined"
                                    sx={{ minWidth: '100px', color: '#3B71CA' }}
                                >
                                    <MenuItem value="TODO">TODO</MenuItem>
                                    <MenuItem value="DONE">DONE</MenuItem>
                                </Select>
                            </Grid>
                        </Grid>
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>
                                        Title
                                    </StyledTableCell>
                                    <StyledTableCell>Description</StyledTableCell>
                                    <StyledTableCell>
                                        Status
                                    </StyledTableCell>
                                    <StyledTableCell className="sortCell">
                                        <TableSortLabel
                                            active={orderBy === 'dueDate'}
                                            direction={orderBy === 'dueDate' ? order : 'asc'}
                                            onClick={() => this.handleSort('dueDate')}>
                                            <TbArrowsSort style={{ marginRight: '12px' }}/>
                                            Due Date
                                        </TableSortLabel>
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        Actions
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedTasks.map(task => (
                                    <StyledTableRow key={task.id}>
                                        <StyledTableCell>
                                            {task.title}
                                        </StyledTableCell>
                                        <StyledTableCell>{task.description}</StyledTableCell>
                                        <StyledTableCell>{task.status}</StyledTableCell>
                                        <StyledTableCell>{task.dueDate}</StyledTableCell>
                                        <StyledTableCell>
                                            <Button variant="contained" color="primary" onClick={() => this.handleEdit(task)}>
                                                <FaPen size="1.5em" style={{ marginRight: '12px' }} /> Edit Status
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
                <Dialog open={editDialogOpen} onClose={this.handleEditClose}>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogContent>
                        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                        <Select
                            fullWidth
                            value={editedTask.status}
                            onChange={this.handleEditInput}
                            name="status"
                            sx={{marginTop: 2}}
                        >
                            <MenuItem value="TODO">TODO</MenuItem>
                            <MenuItem value="DONE">DONE</MenuItem>
                        </Select>
                        <Button onClick={this.handleEditSubmit} variant="contained" color="primary" sx={{marginTop: 2}}>
                            Update Task
                        </Button>
                        {updateSuccess && (
                            <Alert severity="success" style={{marginTop: 20}}>
                                Task successfully updated!
                            </Alert>
                        )}
                    </DialogContent>
                </Dialog>
            </>
        );
    }
}

export default History;
