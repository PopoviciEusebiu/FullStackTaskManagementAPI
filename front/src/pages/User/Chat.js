import React, { Component, createRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { Container, TextField, Box, Typography, List, ListItem, ListItemText, Avatar, Badge } from '@mui/material';
import axiosInstance from '../../axios';
import {jwtDecode} from 'jwt-decode';
import '../../styles/chat.css';
import withRouter from '../../utils/withRouter';
import NavbarGroup from "../../utils/NavbarGroup";
import IconButton from "@mui/material/IconButton";
import { IoSend } from "react-icons/io5";

class Chat extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            input: '',
            stompClient: null,
            members: [],
            user: null,
            errorMessage: '',
            isSending: false // Flag to prevent multiple send attempts
        };
        this.messagesEndRef = createRef();
    }

    componentDidMount() {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            this.setState({ user: decoded }, () => {
                this.fetchGroupMembers();
                this.connectToWebSocket(token);
            });
        } else {
            this.setState({ errorMessage: 'No token found, please log in.' });
        }
    }

    componentWillUnmount() {
        if (this.state.stompClient !== null) {
            this.state.stompClient.disconnect();
        }
    }

    connectToWebSocket = (token) => {
        const socket = new SockJS('http://localhost:8080/socket');
        const stompClient = Stomp.over(socket);

        const { groupId } = this.props.params;

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        console.log('Connecting to WebSocket with headers:', headers);

        stompClient.connect(headers, () => {
            console.log('WebSocket connected');
            stompClient.subscribe(`/topic/group/${groupId}`, (message) => {
                if (message.body) {
                    const newMessage = JSON.parse(message.body);
                    console.log('Received message from WebSocket:', newMessage);
                    this.setState((prevState) => {
                        // Check if the new message is a duplicate
                        const isDuplicate = prevState.messages.some(msg => msg.content === newMessage.content && msg.sender === newMessage.sender && msg.timestamp === newMessage.timestamp);
                        if (!isDuplicate) {
                            return { messages: [...prevState.messages, newMessage] };
                        }
                        return null;
                    }, this.scrollToBottom);
                }
            });
        }, (error) => {
            console.error('Error connecting to WebSocket:', error);
            this.setState({ errorMessage: 'Error connecting to WebSocket: ' + error });
            setTimeout(() => this.connectToWebSocket(token), 5000); // Retry connection after 5 seconds
        });

        this.setState({ stompClient });
    }

    fetchGroupMembers = () => {
        const { groupId } = this.props.params;
        this.authenticatedAxios().get(`/group/${groupId}/onlineMembers`)
            .then(response => {
                this.setState({ members: response.data });
            })
            .catch(error => console.error('Error fetching group members:', error));
    }

    sendMessage = () => {
        const { stompClient, input, user, isSending } = this.state;
        const { groupId } = this.props.params;

        if (isSending) {
            return; // Prevent sending multiple messages
        }

        if (stompClient && stompClient.connected && input) {
            this.setState({ isSending: true });
            const chatMessage = {
                sender: user.username,
                content: input,
                groupId: groupId
            };
            console.log('Sending message:', chatMessage);
            stompClient.send(`/app/chat/${groupId}`, {}, JSON.stringify(chatMessage));
            this.setState({ input: '', isSending: false });
        } else {
            this.setState({ errorMessage: 'There is no underlying STOMP connection or input is empty.' });
        }
    }

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    handleInputChange = (event) => {
        this.setState({ input: event.target.value });
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    scrollToBottom = () => {
        if (this.messagesEndRef.current) {
            console.log('Scrolling to bottom');
            this.messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.messages.length !== this.state.messages.length) {
            this.scrollToBottom();
        }
    }

    render() {
        const { messages, input, members, errorMessage } = this.state;
        console.log('Rendering component with messages:', messages);

        return (
            <>
                <NavbarGroup groupName={"Group Chat"}/>
                <Container className="chat-container">
                    <Box className="online-members">
                        {members.map((member, index) => (
                            <Box key={index} className="online-member">
                                <Badge
                                    color="success"
                                    variant="dot"
                                    overlap="circular"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    sx={{ '& .MuiBadge-dot': { backgroundColor: 'lime' } }}
                                >
                                    <Avatar>{member.username.charAt(0).toUpperCase()}</Avatar>
                                </Badge>
                                <Typography style={{ marginLeft: '8px' }}>{member.username}</Typography>
                            </Box>
                        ))}
                    </Box>
                    <List className="chat-messages">
                        {messages.map((message, index) => (
                            <ListItem key={index} className={`chat-message ${message.sender === this.state.user.username ? 'message-sent' : 'message-received'}`}>
                                <Avatar className={`avatar ${message.sender === this.state.user.username ? 'avatar-sent' : ''}`}>
                                    {message.sender.charAt(0).toUpperCase()}
                                </Avatar>
                                <ListItemText
                                    primary={
                                        <Typography className="chat-message-sender">
                                            {message.sender}
                                        </Typography>
                                    }
                                    secondary={
                                        <>
                                            <Typography className="chat-message-content">
                                                {message.content}
                                            </Typography>
                                            <Typography className="chat-timestamp">
                                                {message.timestamp}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        ))}
                        <div ref={this.messagesEndRef} />
                    </List>

                    <Box className="chat-input">
                        <TextField
                            label="Type a message"
                            variant="outlined"
                            fullWidth
                            value={input}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                            className="chat-input-field"
                        />
                        <IconButton color="primary" onClick={this.sendMessage} className="chat-input-button">
                            <IoSend />
                        </IconButton>
                    </Box>
                    {errorMessage && (
                        <Typography color="error" mt={2}>{errorMessage}</Typography>
                    )}
                </Container>
            </>
        );
    }
}

export default withRouter(Chat);
