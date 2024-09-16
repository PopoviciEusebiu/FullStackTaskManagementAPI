import React from "react";
import axiosInstance from "../../axios";
import { List, Button, ListItem, ListItemText, Typography, Box } from "@mui/material";
import { saveAs } from 'file-saver';
import Navbar from "../../utils/Navbar";

class FileExport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            users: [],
        }
    };

    componentDidMount() {
        this.authenticatedAxios()
            .get("/user")
            .then(res => {
                this.setState({ users: res.data });
                console.log(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    exportData(fileType, userId) {
        this.authenticatedAxios().get("/user/export/" + userId, { params: { fileType: fileType }, responseType: 'blob' })
            .then(res => {
                const fileName = `user-data-${userId}.${fileType}`;
                saveAs(res.data, fileName);
                console.log(`Exported: ${fileName}`);
            })
            .catch(error => {
                console.log("Export error: ", error);
            })
    }

    authenticatedAxios = () => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        return axiosInstance;
    }

    render() {
        return (
            <React.Fragment>
                <Navbar />
                <List sx={{ width: '100%', bgcolor: 'background.paper', padding: 2 }}>
                    {this.state.users.map(user => (
                        <ListItem key={user.id} sx={{ marginBottom: 2, boxShadow: 3 }}>
                            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                                    User: {user.username}
                                </Typography>
                                <Box sx={{ display: 'flex', width: '100%' }}>
                                    <Button variant="contained" color="primary" onClick={() => this.exportData("xml", user.id)} sx={{ marginRight: 1 }}>
                                        Export XML
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={() => this.exportData("txt", user.id)}>
                                        Export TXT
                                    </Button>
                                </Box>
                            </Box>
                        </ListItem>
                    ))}
                </List>
            </React.Fragment>
        )
    }
}

export default FileExport;