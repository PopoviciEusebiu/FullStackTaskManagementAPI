import React from 'react';
import { Modal, Button, TextField, Alert } from '@mui/material';
import '../../styles/comment.css';
import axiosInstance from "../../axios";
import {jwtDecode} from "jwt-decode";

class AddComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            user: null,
            task: null,
            errorMessage: '',
            addCommentSuccess: false,
        };
    }

    componentDidMount() {
        const taskData = localStorage.getItem('task');

        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            console.log("Decoded JWT:", decoded);
            this.setState({ user: decoded });
        }

        if (taskData) {
            const task = JSON.parse(taskData);
            this.setState({ task, content: '' });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.open !== this.props.open && !this.props.open) {
            this.setState({ addCommentSuccess: false });
        }
    }

    handleInput(event) {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    onSubmitFunction() {
        const { content, user } = this.state;
        const { task } = this.props;
        console.log(this.props);
        if (!user || !user.username) {
            this.setState({ errorMessage: "User data is missing", addCommentSuccess: false });
            return;
        }

        if (!task || !task.id) {
            this.setState({ errorMessage: "Task data is missing", addCommentSuccess: false });
            return;
        }

        const comment = {
            content,
            user: {
                username: user.username
            },
            task: {
                id: task.id
            }
        };


        this.authenticatedAxios().post("/comment", comment)
            .then(res => {
                this.setState({ addCommentSuccess: true, errorMessage: '', content: '' });
            })
            .catch(error => {
                console.error("Error creating comment:", error);
                this.setState({ errorMessage: "Creation failed. Please try again.", addCommentSuccess: false });
            });
    }

    handleContentChange = (event) => {
        this.setState({ content: event.target.value });
    }

    handleAddComment = () => {
        if (this.state.content.trim() === '') {
            this.setState({ errorMessage: "Content cannot be empty", addCommentSuccess: false });
            return;
        }
        this.onSubmitFunction();
    }
    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    render() {
        const { open, onClose } = this.props;
        const { content, errorMessage, addCommentSuccess } = this.state;

        return (
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="add-comment-modal"
                aria-describedby="add-comment-modal-description"
            >
                <div className="modal-container">
                    <h2 id="add-comment-modal" className="modal-title">Add Comment</h2>
                    <TextField
                        id="content"
                        label="Content"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        value={content}
                        onChange={this.handleContentChange}
                    />
                    {errorMessage && (
                        <Alert severity="error" style={{ marginTop: '10px' }}>{errorMessage}</Alert>
                    )}
                    {addCommentSuccess && (
                        <Alert severity="success" style={{ marginTop: '10px' }}>Comment added successfully!</Alert>
                    )}
                    <div className="modal-button-group">
                        <Button onClick={this.handleAddComment} variant="contained" color="primary" className="modal-button">Add Comment</Button>
                        <Button onClick={onClose} className="modal-button">Cancel</Button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default AddComment;
