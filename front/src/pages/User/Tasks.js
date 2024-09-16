import React from 'react';
import {
    Button,
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
    TableSortLabel
} from '@mui/material';
import axiosInstance from "../../axios";
import { Link } from 'react-router-dom';
import NavbarU from "../../utils/NavbarU";
import DeleteIcon from '@mui/icons-material/Delete';
import { TbArrowsSort } from "react-icons/tb";
import { FaPen } from "react-icons/fa";
import { FaRegCommentAlt } from "react-icons/fa";
import AddComment from './AddComment';
import Comments from './Comments';
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

class Tasks extends React.Component {
    state = {
        tasks: [],
        errorMessage: '',
        orderBy: '',
        order: 'asc',
        isAddCommentOpen: false,
        selectedTask: null,
        seeComments: false,
        selectedTaskTitle: '',
        user: null
    };

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            this.setState({ user: decoded }, () => {
                this.fetchTasks();
            });
        } else {
            this.setState({ errorMessage: "No token found, please log in." });
        }
    }

    fetchTasks = () => {
        const username = this.state.user.username;
        this.authenticatedAxios().get("/task/userTasks", {
            params: { username: username }
        })
            .then(res => {
                this.setState({ tasks: res.data });
            })
            .catch(error => {
                console.error("Failed to fetch tasks:", error);
                this.setState({ errorMessage: "Failed to load tasks." });
            });
    }

    handleDelete = (taskId) => {
        this.authenticatedAxios().delete(`/task/${taskId}`)
            .then(() => {
                this.setState(prevState => ({
                    tasks: prevState.tasks.filter(task => task.id !== taskId)
                }));
            })
            .catch(error => {
                console.error("Failed to delete task:", error);
                this.setState({ errorMessage: "Failed to delete task." });
            });
    }

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    handleSort = (property) => {
        const { orderBy, order } = this.state;
        const isAsc = orderBy === property && order === 'asc';
        this.setState({
            order: isAsc ? 'desc' : 'asc',
            orderBy: property
        });
    }

    handleOpenAddComment = (taskId) => {
        const task = this.state.tasks.find(task => task.id === taskId);
        this.setState({ isAddCommentOpen: true, selectedTask: task });
    }

    handleCloseAddComment = () => {
        this.setState({ isAddCommentOpen: false, selectedTask: null });
    }

    handleOpenComments = (taskId, taskTitle) => {
        const task = this.state.tasks.find(task => task.id === taskId);
        this.setState({ seeComments: true, selectedTask: task, selectedTaskTitle: taskTitle });
    }

    handleCloseComments = () => {
        this.setState({ seeComments: false, selectedTask: null });
    }

    render() {
        const { tasks, errorMessage, orderBy, order, isAddCommentOpen, seeComments, selectedTaskTitle, selectedTask, selectedTask1 } = this.state;
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
                    <Typography variant="h4" style={{ margin: '20px 0' }}>Task List</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Title</StyledTableCell>
                                    <StyledTableCell width="40%">Description</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>
                                        <TableSortLabel
                                            active={orderBy === 'dueDate'}
                                            direction={orderBy === 'dueDate' ? order : 'asc'}
                                            onClick={() => this.handleSort('dueDate')}
                                        >
                                            <TbArrowsSort style={{ marginRight: '12px' }}/>
                                            Due Date
                                        </TableSortLabel>
                                    </StyledTableCell>
                                    <StyledTableCell width="120px">Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedTasks.map(task => (
                                    <StyledTableRow key={task.id}>
                                        <StyledTableCell>
                                            <div onClick={() => this.handleOpenComments(task.id, task.title)}>
                                                {task.title}
                                            </div>
                                        </StyledTableCell>
                                        <StyledTableCell>{task.description}</StyledTableCell>
                                        <StyledTableCell>{task.status}</StyledTableCell>
                                        <StyledTableCell>{task.dueDate}</StyledTableCell>
                                        <StyledTableCell>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Button startIcon={<DeleteIcon />}
                                                        onClick={() => this.handleDelete(task.id)} variant="contained"
                                                        color="primary">Delete</Button>
                                                <Button component={Link} to={`/updateTask/${task.id}`} variant="contained" color="primary">
                                                    <FaPen size="1.5em" style={{ marginRight: '12px' }} /> Edit
                                                </Button>
                                                <FaRegCommentAlt
                                                    size="1.5em"
                                                    style={{ cursor: 'pointer', marginTop: '8px' }}
                                                    onClick={() => this.handleOpenAddComment(task.id)}
                                                />
                                            </div>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <AddComment open={isAddCommentOpen} onClose={this.handleCloseAddComment} task={this.state.selectedTask} />
                    <Comments open={seeComments} handleClose={this.handleCloseComments} taskTitle={selectedTaskTitle} task={this.state.selectedTask}/>
                    {errorMessage && (
                        <Typography color="error">{errorMessage}</Typography>
                    )}
                </Container>
            </>
        );
    }
}

export default Tasks;
