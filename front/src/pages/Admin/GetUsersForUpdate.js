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
    tableCellClasses, styled
} from '@mui/material';
import axiosInstance from "../../axios";
import { Link } from 'react-router-dom';
import Navbar from "../../utils/Navbar";
import { FaPen } from "react-icons/fa";

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

class ListUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            errorMessage: ''
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = () => {
        this.authenticatedAxios().get("/user")
            .then(res => {
                this.setState({
                    users: res.data
                });
            })
            .catch(error => {
                console.error("Failed to fetch users:", error);
                this.setState({ errorMessage: "Failed to load users." });
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
        const { users, errorMessage } = this.state;
        return (
            <>
                <Navbar />
            <Container>
                <Typography variant="h4" style={{ margin: '20px 0' }}>User List</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Username</StyledTableCell>
                                <StyledTableCell>First Name</StyledTableCell>
                                <StyledTableCell>Last Name</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell>Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <StyledTableRow  key={user.id}>
                                    <StyledTableCell>{user.username}</StyledTableCell>
                                    <StyledTableCell>{user.firstName}</StyledTableCell>
                                    <StyledTableCell>{user.lastName}</StyledTableCell>
                                    <StyledTableCell>{user.emailAddress}</StyledTableCell>
                                    <StyledTableCell>
                                        <Link to={`/update/${user.id}`}>
                                            <Button variant="contained" color="primary">
                                                <FaPen size="1.5em" style={{ marginRight: '12px' }}/> Edit
                                            </Button>
                                        </Link>
                                    </StyledTableCell>
                                </StyledTableRow >
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {errorMessage && (
                    <Typography color="error">{errorMessage}</Typography>
                )}
            </Container>
            </>
        );
    }
}

export default ListUsers;
