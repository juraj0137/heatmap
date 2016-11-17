import React from 'react';
import {Link} from 'react-router';

class SideBar extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {

        return (
            <div>
                <div className="navbar-default sidebar" role="navigation">
                    <div className="sidebar-nav navbar-collapse collapse">
                        <ul className="nav">
                            <li><Link to="/list">Heatmap list</Link> </li>
                        </ul>
                    </div>
                </div>
                <div className="clearfix"></div>
            </div>
        );
    }
}

export default SideBar