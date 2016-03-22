'use strict';
import './navigation.less';
import React from 'react';

import Sidebar from './sidebar';
import Topbar from './topbar';

class Menu extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <Topbar {...this.props}/>
                <Sidebar/>
            </nav>
        );
    }
}

export default Menu;
