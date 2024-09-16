import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import axiosInstance from "../../axios";
import {
    Paper,
    styled,
    Table, TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import withRouter from '../../utils/withRouter';
import Navbar from "../../utils/Navbar";

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

class SeeUserTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminId: props.params.adminId,
            userId: props.params.userId,
            tasks: []
        };
    }

    componentDidMount() {
        this.authenticatedAxios().get(`/user/${this.state.adminId}/tasks/${this.state.userId}`)
            .then(response => {
                this.setState({ tasks: response.data });
            })
            .catch(error => {
                console.error("Failed to fetch tasks:", error);
                this.setState({ errorMessage: "Failed to fetch tasks." });
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
        const { tasks } = this.state;
        return (
            <>
                <Navbar />
                <Container>
                    <Typography variant="h4" style={{ margin: '20px 0' }}>Tasks for user: </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Title</StyledTableCell>
                                    <StyledTableCell>Description</StyledTableCell>
                                    <StyledTableCell>Due Date</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map(task => (
                                    <StyledTableRow  key={task.id}>
                                        <StyledTableCell>{task.title}</StyledTableCell>
                                        <StyledTableCell>{task.description}</StyledTableCell>
                                        <StyledTableCell>{task.dueDate}</StyledTableCell>
                                        <StyledTableCell>{task.status}</StyledTableCell>
                                    </StyledTableRow >
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Container>
            </>
        )
    }
}

export default withRouter(SeeUserTasks);

