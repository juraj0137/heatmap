import './app.less';
import React from "react";
import { Alert } from 'react-bootstrap';

import Menu from './../components/navigation/menu.js';
import FlashMessages from './../components/flashMessages/FlashMessages.react.js';

class LayoutApp extends React.Component {

    constructor(props) {
        super(props);

        this.resizePageWrapper = this.resizePageWrapper.bind(this);
    }

    componentDidMount() {
        this.resizePageWrapper();
    }

    componentDidUpdate() {
        this.resizePageWrapper();
    }

    resizePageWrapper() {
        const page = this.refs['page-wrapper'];
        const topbar = document.getElementsByClassName('navbar-static-top')[0];

        if (window.innerHeight > (page.clientHeight + topbar.offsetHeight)) {
            page.style.height = (window.innerHeight - topbar.offsetHeight) + 'px';
        }
    }

    render() {

        return (
            <div>
                <Menu />
                <div id="page-wrapper" ref="page-wrapper">
                    <FlashMessages />
                    {this.props.children}
                </div>
            </div>
        );
    }

}

export default LayoutApp;