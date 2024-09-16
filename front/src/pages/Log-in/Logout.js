import React, { Component } from 'react';
import withRouter from "../../utils/withRouter";
import axiosInstance from "../../axios";

class Logout extends Component {
    componentDidMount() {
        axiosInstance.get('/logout', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
            .then(response => {
                localStorage.removeItem('jwtToken');
                this.props.navigate('/login');
            })
            .catch(error => {
                console.error('Logout failed:', error);
            });
    }

    render() {
        return (
            <div>Logging out...</div>
        );
    }
}

export default withRouter(Logout);
