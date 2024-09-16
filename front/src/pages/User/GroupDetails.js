// GroupDetails.js
import React, { Component } from 'react';
import { Container, Tabs, Tab, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, styled, tableCellClasses, Button } from '@mui/material';
import axiosInstance from '../../axios';
import { jwtDecode } from 'jwt-decode';
import NavbarGroup from "../../utils/NavbarGroup";
import withRouter from '../../utils/withRouter';
import DeleteIcon from '@mui/icons-material/Delete';
import { FaPen } from "react-icons/fa";
import UpdateGroupTask from "./UpdateGroupTask";
import AddGroupTask from "./AddGroupTask";
import { AddTaskContext } from '../../utils/AddTaskContext'; // Import context

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

class GroupDetails extends Component {
    static contextType = AddTaskContext; // Adăugați linia aceasta

    constructor(props) {
        super(props);
        this.state = {
            group: null,
            members: [],
            tasks: [],
            selectedTab: 0,
            user: null,
            errorMessage: null,
            isUpdateTaskOpen: false,
            taskToUpdate: null,
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            this.setState({
                user: decoded,
            }, () => {
                const { groupId } = this.props.params;
                this.fetchGroupDetails(groupId);
            });
        } else {
            this.setState({ errorMessage: "No token found, please log in." });
        }
    }

    fetchGroupDetails = (groupId) => {
        this.authenticatedAxios().get(`/group/${groupId}`)
            .then(response => {
                this.setState({ group: response.data });
                this.fetchMembers(groupId);
                this.fetchTasks(groupId);
            })
            .catch(error => console.error('Error fetching group details:', error));
    };

    fetchMembers = (groupId) => {
        this.authenticatedAxios().get(`/group/${groupId}/members`)
            .then(response => {
                this.setState({ members: response.data });
            })
            .catch(error => console.error('Error fetching members:', error));
    };

    fetchTasks = (groupId) => {
        this.authenticatedAxios().get(`/group/${groupId}/tasks`)
            .then(response => {
                this.setState({ tasks: response.data });
            })
            .catch(error => console.error('Error fetching tasks:', error));
    };

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    handleTabChange = (event, newValue) => {
        this.setState({ selectedTab: newValue });
    };

    handleEditTask = (taskId) => {
        const taskToUpdate = this.state.tasks.find(task => task.id === taskId);
        this.setState({ taskToUpdate, isUpdateTaskOpen: true });
    };

    handleDeleteTask = (taskId) => {
        const { groupId } = this.props.params;
        this.authenticatedAxios().delete(`/group/${groupId}/task/${taskId}`)
            .then(() => {
                this.setState(prevState => ({
                    tasks: prevState.tasks.filter(task => task.id !== taskId)
                }));
            })
            .catch(error => {
                console.error('Error deleting task:', error);
                this.setState({ errorMessage: 'Failed to delete task.' });
            });
    };

    handleUpdateTaskClose = () => {
        this.setState({ isUpdateTaskOpen: false });
    };

    handleEnroll = () => {
        const { user } = this.state;
        const { groupId } = this.props.params;

        this.authenticatedAxios().post(`/group/${groupId}/users/${user.id}/enroll`)
            .then(response => {
                this.setState({ group: response.data });
                this.fetchMembers(groupId);
                alert('Successfully enrolled in the group');
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    alert('You are already in this group.');
                } else {
                    console.error('Error enrolling in group:', error);
                    this.setState({ errorMessage: 'Failed to enroll in group.' });
                }
            });
    };

    handleLeave = () => {
        const { user } = this.state;
        const { groupId } = this.props.params;

        this.authenticatedAxios().delete(`/group/${groupId}/users/${user.id}/leave`)
            .then(response => {
                this.setState({ group: response.data });
                this.fetchMembers(groupId);
                alert('Successfully left the group');
            })
            .catch(error => {
                if (error.response && error.response.status === 403) {
                    alert('You are not a member of this group.');
                } else {
                    console.error('Error leaving group:', error);
                    this.setState({ errorMessage: 'Failed to leave group.' });
                }
            });
    };

    render() {
        const { group, members, tasks, selectedTab, errorMessage, isUpdateTaskOpen, taskToUpdate } = this.state;
        const { isAddTaskOpen, closeAddTask } = this.context;

        return (
            <>
                <NavbarGroup groupName={group ? group.name : "Group"} groupId={this.props.params.groupId} />
                <Container>
                    <Box display="flex" justifyContent="center" mb={4}>
                        <Tabs value={selectedTab} onChange={this.handleTabChange} centered>
                            <Tab label="Group" />
                            <Tab label="Members" />
                        </Tabs>
                    </Box>
                    {selectedTab === 0 && (
                        <Box>
                            <Typography variant="h6" style={{ margin: '20px 0' }}>Tasks</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Title</StyledTableCell>
                                            <StyledTableCell>Description</StyledTableCell>
                                            <StyledTableCell>Status</StyledTableCell>
                                            <StyledTableCell>Due Date</StyledTableCell>
                                            <StyledTableCell>Actions</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {tasks.map(task => (
                                            <StyledTableRow key={task.id}>
                                                <StyledTableCell>{task.title}</StyledTableCell>
                                                <StyledTableCell>{task.description}</StyledTableCell>
                                                <StyledTableCell>{task.status}</StyledTableCell>
                                                <StyledTableCell>{task.dueDate}</StyledTableCell>
                                                <StyledTableCell>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <Button onClick={() => this.handleEditTask(task.id)} variant="contained" color="primary">
                                                            <FaPen size="1.5em" style={{ marginRight: '12px' }} /> Edit
                                                        </Button>
                                                        <Button startIcon={<DeleteIcon />} onClick={() => this.handleDeleteTask(task.id)} variant="contained" color="primary">
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    {selectedTab === 1 && (
                        <Box>
                            <Typography variant="h6" style={{ margin: '20px 0' }}>Members</Typography>
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Username</StyledTableCell>
                                            <StyledTableCell>First Name</StyledTableCell>
                                            <StyledTableCell>Last Name</StyledTableCell>
                                            <StyledTableCell>Email</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {members.map(member => (
                                            <StyledTableRow key={member.id}>
                                                <StyledTableCell>{member.username}</StyledTableCell>
                                                <StyledTableCell>{member.firstName}</StyledTableCell>
                                                <StyledTableCell>{member.lastName}</StyledTableCell>
                                                <StyledTableCell>{member.emailAddress}</StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                    {errorMessage && (
                        <Typography color="error">{errorMessage}</Typography>
                    )}

                    {/* Add Task Dialog */}
                    <AddGroupTask
                        isOpen={isAddTaskOpen}
                        onClose={closeAddTask}
                        groupId={this.props.params.groupId}
                        refreshTasks={() => this.fetchTasks(this.props.params.groupId)}
                    />

                    {taskToUpdate && (
                        <UpdateGroupTask
                            isOpen={isUpdateTaskOpen}
                            task={taskToUpdate}
                            onClose={this.handleUpdateTaskClose}
                            groupId={this.props.params.groupId}
                            userId={this.state.user.id}
                            refreshTasks={() => this.fetchTasks(this.props.params.groupId)}
                        />
                    )}
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button variant="contained" color="primary" onClick={this.handleEnroll} sx={{ mx: 2 }}>
                            Enroll
                        </Button>
                        <Button variant="contained" color="secondary" onClick={this.handleLeave} sx={{ mx: 2 }}>
                            Leave
                        </Button>
                    </Box>
                </Container>
            </>
        );
    }
}

export default withRouter(GroupDetails);
