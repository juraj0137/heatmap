import React from 'react';
import { Link } from 'react-router';

class Topbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                        <span className="icon-bar"/>
                    </button>
                    <Link to="/" className="navbar-brand">Heatmap</Link>
                </div>
                <ul className="nav navbar-top-links navbar-right">
                    <li className="dropdown">
                        <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                            Login<i className="fa fa-user fa-fw"/> <i className="fa fa-caret-down"/>
                        </a>
                        <ul className="dropdown-menu dropdown-user">
                            <li>
                                <a>
                                    <i className="fa fa-sign-out fa-fw"/>Logout
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Topbar;
