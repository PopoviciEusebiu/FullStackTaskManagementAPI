import React, { Component } from 'react';
import axiosInstance from "../../axios";
import "../../styles/groupList.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import {jwtDecode} from 'jwt-decode';
import NavbarU from "../../utils/NavbarU";
import { Container } from "@mui/material";
import withRouter from "../../utils/withRouter";

class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            user: null,
            errorMessage: null,
            currentPage: 1,
            groupsPerPage: 3,
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            console.log('Decoded JWT:', decoded);
            this.setState({ user: decoded }, () => {
                this.fetchGroups();
            });
        } else {
            this.setState({ errorMessage: "No token found, please log in." });
        }
    }

    fetchGroups = () => {
        this.authenticatedAxios().get('/group')
            .then(response => {
                console.log('Groups fetched:', response.data);
                this.setState({ groups: response.data });
            })
            .catch(error => {
                console.error('Error fetching groups:', error);
                this.setState({ errorMessage: 'Error fetching groups.' });
            });
    };

    handleJoin = (groupId) => {
        const userId = this.state.user && this.state.user.id;
        if (userId) {
            this.authenticatedAxios().post(`/group/${groupId}/users/${userId}/enroll`, { userId })
                .then(response => alert('Joined successfully!'))
                .catch(error => {
                    if (error.response && error.response.status === 409) {
                        alert('You are already in this group.');
                    } else {
                        console.error('Error joining group:', error);
                    }
                });
        } else {
            console.error('User ID not found.');
        }
    };

    handleDelete = (groupId) => {
        const userId = this.state.user && this.state.user.id;
        if (userId) {
            this.authenticatedAxios().delete(`/group/${groupId}/user/${userId}`)
                .then(response => {
                    alert('Left the group successfully!');
                    this.fetchGroups(); // Refresh the group list
                })
                .catch(error => {
                    if (error.response && error.response.status === 403) {
                        alert('You are not a member of this group.');
                    } else {
                        console.error('Error leaving group:', error);
                    }
                });
        } else {
            console.error('User ID not found.');
        }
    };

    handleDoubleClick = (groupId) => {
        this.props.navigate(`/group/${groupId}`);
    };

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    handlePageChange = (newPage) => {
        this.setState({ currentPage: newPage });
    };

    render() {
        const { groups, currentPage, groupsPerPage, errorMessage } = this.state;

        const indexOfLastGroup = currentPage * groupsPerPage;
        const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
        const currentGroups = groups.slice(indexOfFirstGroup, indexOfLastGroup);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(groups.length / groupsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <>
                <NavbarU />
                <Container className="group-list-container">
                    {errorMessage && <p>{errorMessage}</p>}
                    <div className="group-list">
                        {currentGroups.map(group => (
                            <div
                                key={group.id}
                                className="group-card"
                                onDoubleClick={() => this.handleDoubleClick(group.id)}
                            >
                                <FontAwesomeIcon icon={faUsers} className="group-icon" />
                                <h2>{group.name}</h2>
                                <p>{group.description}</p>
                                <div className="button-group">
                                    <button onClick={() => this.handleJoin(group.id)}>Join Group</button>
                                    <button className="leave-button" onClick={() => this.handleDelete(group.id)}>Delete Group</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                onClick={() => this.handlePageChange(number)}
                                disabled={currentPage === number}
                            >
                                {number}
                            </button>
                        ))}
                    </div>
                </Container>
            </>
        );
    }
}

export default withRouter(GroupList);
