import React, { Component } from 'react';
import '../../styles/support.css';
import NavbarU from '../../utils/NavbarU';
import axiosInstance from "../../axios";

class ContactUs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            subject: '',
            content: '',
            message: '',
            messageType: ''  // Adaugă o stare pentru tipul de mesaj (success sau error)
        };
    }

    handleEmailChange = (event) => {
        this.setState({ email: event.target.value });
    }

    handleSubjectChange = (event) => {
        this.setState({ subject: event.target.value });
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const { email, subject, content } = this.state;

        this.authenticatedAxios().post('/email/send-email', {
            from: email,
            subject: subject,
            content: content
        })
            .then(response => {
                this.setState({
                    email: '',
                    subject: '',
                    content: '',
                    message: 'Email sent successfully!',
                    messageType: 'success'
                });
            })
            .catch(error => {
                this.setState({
                    message: 'Failed to send email. Please try again.',
                    messageType: 'error'
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
        const { email, subject, content, message, messageType } = this.state;
        return (
            <div className="contact-page-container">
                <NavbarU/>
                <div className="contact-form-container">
                    <h1>Contact Us</h1>
                    <form onSubmit={this.handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label className="form-label">Email:</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Enter your email"
                                value={email}
                                onChange={this.handleEmailChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Subject:</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Enter your subject"
                                value={subject}
                                onChange={this.handleSubjectChange}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Content:</label>
                            <textarea
                                className="form-textarea"
                                placeholder="Enter your message"
                                value={content}
                                onChange={this.handleContentChange}
                                style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px' }}  // Stilizare pentru a arăta ca TextField
                            />
                        </div>
                        {message && (
                            <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '10px', color: messageType === 'success' ? 'green' : 'red' }}>
                                {message}
                            </div>
                        )}
                        <button type="submit" className="form-button" style={{ marginTop: '20px', backgroundColor: 'blue', color: 'white' }}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ContactUs;