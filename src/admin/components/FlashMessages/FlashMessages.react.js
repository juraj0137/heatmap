import './flash_messages.less';
import React from "react";
import { Alert } from 'react-bootstrap';
import { connect } from 'react-redux';

import {removeFlashmessage} from './../../app/actions.js';
import FlashMessage, {DEFAULT_DISMISS} from './../../../common/model/flashMessage.js';

class FlashMessages extends React.Component {

    constructor(props) {
        super(props);

        this.renderMessage = this.renderMessage.bind(this);
    }

    renderMessage(msg, i){

        const self = this;

        let handleDismiss,
            dismissTime,
            timer,
            time;

        handleDismiss = function () {
            self.props.dispatch(removeFlashmessage(this));
        };

        dismissTime = '';
        if (msg.dismissAfter != DEFAULT_DISMISS) {
            time = Math.ceil(msg.dismissAfter / 1000);
            dismissTime = (<small className="dismiss-time" ref={`time${i}`}>{time--}s</small>);

            timer = setInterval(()=> {
                if (self.refs['time' + i] != undefined) {
                    self.refs['time' + i].innerHTML = (time--) + 's';
                } else {
                    clearInterval(timer);
                }
            }, 1000);
        }

        return (
            <Alert key={i} bsStyle={msg.type} onDismiss={handleDismiss.bind(msg)} dismissAfter={msg.dismissAfter}>
                {dismissTime}
                {msg.title.length > 0 ? (<h4>{msg.title}</h4>) : ''}
                {msg.text.length > 0 ? (<p>{msg.text}</p>) : ''}
                {msg.html != '' ? msg.html : ''}
            </Alert>
        );
    }

    render() {

        const messages = this.props.flashMessages.map((message, i) => {
            if (message instanceof FlashMessage) {
                return this.renderMessage(message, i);
            }
        });

        return (
            <div className="row flash-messages-wrapper">
                {messages}
            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        flashMessages: state.flashMessages.flashMessages
    }
}
export default connect(mapStateToProps)(FlashMessages);