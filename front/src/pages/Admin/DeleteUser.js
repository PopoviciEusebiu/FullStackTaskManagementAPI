import React from 'react';
import {
    Checkbox,
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
    Alert,
    styled, tableCellClasses
} from '@mui/material';
import axiosInstance from "../../axios";
import DeleteIcon from '@mui/icons-material/Delete';
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

class DeleteUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            selected: [],
            errorMessage: '',
            deleteSuccess: false
        };
    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = () => {
        axiosInstance
            .get("/user")
            .then(res => {
                this.setState({
                    users: res.data
                });
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleSelect = (id) => {
        const { selected } = this.state;
        this.setState({
            selected: selected.includes(id) ? selected.filter(sid => sid !== id) : [...selected, id]
        });
    }

    handleSelectAll = (event) => {
        if (event.target.checked) {
            this.setState({ selected: this.state.users.map(user => user.id) });
        } else {
            this.setState({ selected: [] });
        }
    }

    deleteSelectedUsers = () => {
        const idsToDelete = this.state.selected;

        this.authenticatedAxios().post('/user/delete', idsToDelete)
            .then(() => {
                this.setState({
                    deleteSuccess: true,
                    selected: []
                });
                this.fetchUsers();
            })
            .catch(err => {
                console.error("Failed to delete users:", err);
                this.setState({ errorMessage: "Failed to delete users." });
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
        const { users, selected, errorMessage, deleteSuccess } = this.state;
        return (
            <>
                <Navbar />
            <Container>
                <Typography variant="h4" style={{ margin: '20px 0' }}>Delete Users</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <StyledTableRow>
                                <StyledTableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={selected.length > 0 && selected.length < users.length}
                                        checked={users.length > 0 && selected.length === users.length}
                                        onChange={this.handleSelectAll}
                                    />
                                </StyledTableCell>
                                <StyledTableCell>Username</StyledTableCell>
                                <StyledTableCell>First Name</StyledTableCell>
                                <StyledTableCell>Last Name</StyledTableCell>
                                <StyledTableCell>Email</StyledTableCell>
                            </StyledTableRow>
                        </TableHead>
                        <TableBody>
                            {users.map(user => (
                                <StyledTableRow key={user.id} selected={selected.includes(user.id)}>
                                    <StyledTableCell padding="checkbox">
                                        <Checkbox
                                            checked={selected.includes(user.id)}
                                            onChange={() => this.handleSelect(user.id)}
                                        />
                                    </StyledTableCell>
                                    <StyledTableCell>{user.username}</StyledTableCell>
                                    <StyledTableCell>{user.firstName}</StyledTableCell>
                                    <StyledTableCell>{user.lastName}</StyledTableCell>
                                    <StyledTableCell>{user.emailAddress}</StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DeleteIcon />}
                    onClick={this.deleteSelectedUsers}
                    style={{ marginTop: '20px' }}
                >
                    Delete Selected
                </Button>
                {deleteSuccess && (
                    <Alert severity="success" style={{ marginTop: '20px' }}>
                        Users deleted successfully!
                    </Alert>
                )}
                {errorMessage && (
                    <Alert severity="error" style={{ marginTop: '20px' }}>
                        {errorMessage}
                    </Alert>
                )}
            </Container>
            </>
        );
    }
}

export default DeleteUsers;
