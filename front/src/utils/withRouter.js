import React from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';

function withRouter(Component) {
    return function ComponentWithRouterProps(props) {
        let params = useParams();
        let navigate = useNavigate();
        let location = useLocation();
        return <Component {...props} params={params} navigate={navigate} location={location} />;
    }
}

export default withRouter;