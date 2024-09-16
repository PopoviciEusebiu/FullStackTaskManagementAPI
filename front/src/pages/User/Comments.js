import React from 'react';
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comments: [],
            editModeEnabled: false,
            editedComments: {},
            currentPage: 0,
            commentsPerPage: 3,
        };
    }

    componentDidMount() {
        this.fetchComments(this.props.task);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.task !== this.props.task) {
            this.fetchComments(this.props.task);
            this.setState({ editModeEnabled: false, currentPage: 0 });
        }
    }

    fetchComments(task) {
        if (task) {
            this.authenticatedAxios().get(`/comment/fromTask/${task.id}`)
                .then(res => {
                    this.setState({
                        comments: res.data,
                        editedComments: res.data.reduce((acc, comment) => ({
                            ...acc,
                            [comment.id]: comment.content
                        }), {})
                    });
                })
                .catch(error => {
                    console.error("Failed to fetch comments:", error);
                });
        } else {
            this.setState({ comments: [], errorMessage: "No comments found." });
        }
    }

    toggleEditAll = () => {
        this.setState(prevState => ({ editModeEnabled: !prevState.editModeEnabled }));
    };

    handleContentChange = (id, event) => {
        const newContent = event.target.value;
        this.setState(prevState => ({
            editedComments: {
                ...prevState.editedComments,
                [id]: newContent
            }
        }));
    };

    saveComment = (id) => {
        const content = this.state.editedComments[id];
        axiosInstance.put(`/comment/${id}`, { content })
            .then(res => {
                this.fetchComments(this.props.task);
            })
            .catch(error => {
                console.error("Failed to update comment:", error);
            });
    };

    deleteComment = (id) => {
        this.authenticatedAxios().delete(`/comment/${id}`)
            .then(res => {
                const remainingComments = this.state.comments.filter(comment => comment.id !== id);
                let newCurrentPage = this.state.currentPage;
                if (remainingComments.length <= this.state.currentPage * this.state.commentsPerPage) {
                    newCurrentPage = Math.max(0, newCurrentPage - 1);
                }
                this.setState({
                    comments: remainingComments,
                    currentPage: newCurrentPage,
                    errorMessage: remainingComments.length === 0 ? "No comments on this page." : ""
                });
            })
            .catch(error => {
                console.error("Failed to delete comment:", error);
            });
    };

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    changePage = (increment) => {
        this.setState(prevState => ({
            currentPage: prevState.currentPage + increment
        }));
    };

    render(){
        const { open, handleClose, task } = this.props;
        const { comments, editModeEnabled, editedComments, errorMessage, currentPage, commentsPerPage } = this.state;
        const indexOfLastComment = (currentPage + 1) * commentsPerPage;
        const indexOfFirstComment = indexOfLastComment - commentsPerPage;
        const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

        return (
            <React.Fragment>
                <CssBaseline />
                <GlobalStyles
                    styles={(theme) => ({
                        body: { backgroundColor: theme.palette.background.default },
                    })}
                />
                {task ? (
                    <Modal
                        open={open}
                        onClose={() => {
                            this.setState({ editModeEnabled: false });
                            handleClose();
                        }}
                        aria-labelledby="modal-title"
                        aria-describedby="modal-description"
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 600,
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            <Fab
                                color="primary"
                                sx={{
                                    position: 'absolute',
                                    bottom: (theme) => theme.spacing(2),
                                    right: (theme) => theme.spacing(2),
                                }}
                                onClick={this.toggleEditAll}
                            >
                                <EditIcon />
                            </Fab>
                            <Typography id="modal-title" variant="h5" component="h2" gutterBottom>
                                {task.title}
                            </Typography>
                            {comments.length > 0 ? (
                                currentComments.map((comment) => (
                                    <Card key={comment.id} sx={{ my: 2, boxShadow: 5, width: '100%' }}>
                                        <CardContent>
                                            {editModeEnabled ? (
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    value={editedComments[comment.id]}
                                                    onChange={(e) => this.handleContentChange(comment.id, e)}
                                                    onBlur={() => this.saveComment(comment.id)}
                                                    sx={{ mb: 2, boxShadow: 3 }}
                                                />
                                            ) : (
                                                <Typography variant="subtitle1" component="div">
                                                    {comment.content}
                                                </Typography>
                                            )}
                                            <IconButton onClick={() => this.deleteComment(comment.id)} color="error" sx={{ position: 'absolute', top: 10, right: 10 }}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center', width: '100%' }}>
                                    {errorMessage || "No comments found."}
                                </Typography>
                            )}
                            {comments.length > commentsPerPage && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={currentPage === 0}
                                        startIcon={<ArrowBackIosNewIcon />}
                                        onClick={() => this.changePage(-1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={indexOfLastComment >= comments.length}
                                        endIcon={<ArrowForwardIosIcon />}
                                        onClick={() => this.changePage(1)}
                                    >
                                        Next
                                    </Button>
                                </Box>
                            )}
                            <Button variant="contained" color="primary" onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
                        </Box>
                    </Modal>
                ) : null}
            </React.Fragment>
        )
    }
}

export default Comments;
