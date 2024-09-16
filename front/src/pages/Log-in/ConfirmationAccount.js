import React from 'react';
import  withRouter  from "../../utils/withRouter";
import axiosInstance from "../../axios";

class ConfirmationAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmationSuccess: false,
            errorMessage: ""
        };
    }

    componentDidMount() {
        const token = this.props.params.confirmationToken;
        console.log(this.props.params);
        this.confirmAccount(token);
    }

    confirmAccount(token) {
        axiosInstance.post(`/confirm/${token}`)
            .then(response => {
                if (response.data) {
                    console.log("Account confirmed successfully");
                    this.setState({ confirmationSuccess: true }, () => {
                        setTimeout(() => {
                            this.props.navigate('/login');
                            window.location.reload();
                        }, 3000);
                    });
                }
            })
            .catch(error => {
                console.log("Confirmation failed: ", error);
                this.setState({ errorMessage: "Confirmation failed. Please try again or contact support." });
            });
    }

    render() {
        const { confirmationSuccess, errorMessage } = this.state;
        return (
            <div>
                {confirmationSuccess ? (
                    <div>
                        <h1>Account Successfully Confirmed!</h1>
                        <p>You will be redirected to the login page shortly.</p>
                    </div>
                ) : (
                    <div>
                        <h1>Error Confirming Account</h1>
                        <p>{errorMessage}</p>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(ConfirmationAccount);
