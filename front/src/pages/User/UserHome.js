import React from "react";
import NavbarU from "../../utils/NavbarU";
import Calendar from "../../utils/Calendar";
import  withRouter  from "../../utils/withRouter";



class UserHome extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            selectedDate: new Date()
        };
    }

    handleDateChange = (date) => {
        this.setState({ selectedDate: date});
    };


    render() {
        return(
            <>
                <NavbarU />
                <Calendar onDateChange={this.handleDateChange}/>
            </>
        )
    }
}

export default withRouter(UserHome);