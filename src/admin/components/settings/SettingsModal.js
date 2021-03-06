import './settings.less';
import React from "react";
import { connect } from 'react-redux';
import {Modal, Button, Row, Col, Input, DropdownButton, MenuItem, ButtonGroup, Alert} from "react-bootstrap";

import Heatmap, * as HeatmapUtils from './../../../server/db/model/heatmap.js';
import {addHeatmap, updateHeatmap} from './../../list/actions.js';

class SettingsModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: (props.show !== undefined && props.show === true),
            errors: {
                matchType: [null, ''],
                matchStrings: [null, ''],
                snapshotUrl: [null, ''],
                title: [null, '']
            },
            id: HeatmapUtils.UNDEFINED_ID,
            status: HeatmapUtils.STATUS_ACTIVE,
            matchType: HeatmapUtils.TYPE_UNDEFINED,
            matchStrings: [''],
            snapshotUrl: '',
            title: '',
            flashMessage: {
                type: 'info',
                text: ''
            }
        };

        this.save = this.save.bind(this);
        this.close = this.close.bind(this);
        this.handleChangeType = this.handleChangeType.bind(this);
        this.handleChangeTitle = this.handleChangeTitle.bind(this);
        this.handleChangeMatchString = this.handleChangeMatchString.bind(this);
        this.handleChangeSnapshotUrl = this.handleChangeSnapshotUrl.bind(this);
        this.updateHeatmap = this.updateHeatmap.bind(this);
        this.saveNewHeatmap = this.saveNewHeatmap.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        let newState = {visible: (nextProps.show !== undefined && nextProps.show === true)};
        if (typeof nextProps.editedHeatmap == "object" && nextProps.editedHeatmap != null &&
            (this.state.id == HeatmapUtils.UNDEFINED_ID || this.state.id != nextProps.editedHeatmap.id )) {

            let {editedHeatmap} = nextProps;
            newState.id = editedHeatmap.id;
            newState.status = editedHeatmap.status;
            newState.matchType = editedHeatmap.matchType;
            newState.matchStrings = editedHeatmap.matchStrings;
            newState.snapshotUrl = editedHeatmap.snapshotUrl;
            newState.title = editedHeatmap.title;

            this.clearErrors();
        }

        this.setState(newState);
    }

    close() {
        this.setState({
            visible: false,
            flashMessage: {type: 'info', text: ''}
        });
        this.onHide();
    }

    save() {
        if (this.checkErrors()){
            if (this.state.id == HeatmapUtils.UNDEFINED_ID)
                this.saveNewHeatmap();
            else
                this.updateHeatmap();
        }
    }

    saveNewHeatmap() {

        let {dispatch} = this.props,
            {status, matchType, matchStrings, snapshotUrl, title} = this.state;

        this.setState({flashMessage: {type: 'info', text: 'Saving ...'}});
        let addSuccess = ()=> {
            this.setState({flashMessage: {type: 'success', text: 'Configuration has been saved'}});
            setTimeout(()=> {
                this.close();
                this.onHide();
            }, 2000);
        };

        let addFailed = () => {
            this.setState({
                flashMessage: {
                    type: 'danger',
                    text: 'During saving error occured, try again later.'
                }
            });
        };

        if(matchType == HeatmapUtils.TYPE_FULL_URL){
            snapshotUrl = matchStrings[0];
        }

        dispatch(addHeatmap(new Heatmap({
            status: status,
            title: title,
            matchType: matchType,
            matchStrings: matchStrings,
            snapshotUrl: snapshotUrl
        }), addSuccess, addFailed));
    }

    updateHeatmap() {

        let {dispatch} = this.props,
            {id, status, matchType, matchStrings, snapshotUrl, title} = this.state;

        this.setState({flashMessage: {type: 'info', text: 'Saving ...'}});

        let updateSuccess = ()=> {
            this.setState({flashMessage: {type: 'success', text: 'Configuration has been saved'}});
            setTimeout(()=> {
                this.close();
                this.onHide();
            }, 1200);
        };

        let updateFailed = () => {
            this.setState({
                flashMessage: {
                    type: 'danger',
                    text: 'During saving error occured, try again later.'
                }
            });
        };

        if(matchType == HeatmapUtils.TYPE_FULL_URL){
            snapshotUrl = matchStrings[0];
        }

        let EditedHeatmap = this.props.heatmaps.filter((heatmap)=> {
            return heatmap.id == id
        })[0];

        EditedHeatmap = EditedHeatmap.set('status', status);
        EditedHeatmap = EditedHeatmap.set('title', title);
        EditedHeatmap = EditedHeatmap.set('matchType', matchType);
        EditedHeatmap = EditedHeatmap.set('matchStrings', matchStrings);
        EditedHeatmap = EditedHeatmap.set('snapshotUrl', snapshotUrl);

        dispatch(updateHeatmap(EditedHeatmap, updateSuccess, updateFailed));
    }

    onHide() {
        if (typeof this.props.onHide === "function") {
            this.props.onHide.call(this);
        }
    }

    clearErrors() {
        this.setState({
            errors: {
                matchType: [null, ''],
                matchStrings: [null, ''],
                snapshotUrl: [null, ''],
                title: [null, '']
            }
        });
    }

    checkErrors() {

        let errors = {
            matchType: [null, ''],
            matchStrings: [null, ''],
            snapshotUrl: [null, ''],
            title: [null, '']
        };

        let {title, matchType, matchStrings, snapshotUrl} = this.state;

        if (title.length === 0) {
            errors.title = ["error", "You have to write title of configuration"];
        }

        if (matchType == HeatmapUtils.TYPE_UNDEFINED) {
            errors.matchType = ["error", "You have to choose type of heatmap"];
        } else {
            if (matchStrings.filter(item => {
                    return item.trim().length != 0
                }).length == 0) {
                errors.matchStrings = ["error", "You have to write url for collecting data"];
            }
        }

        switch (matchType) {
            case HeatmapUtils.TYPE_START_WITH:
            case HeatmapUtils.TYPE_BULK:
            case HeatmapUtils.TYPE_REGEX:
                if (snapshotUrl.length == 0) {
                    errors.snapshotUrl = ["error", "You have to write snapshot url"];
                }
        }

        // zmenime stav
        this.setState({errors: errors});

        // ak nie su errory vratime true, inac false
        return Object.keys(errors).filter(key => {
                return errors[key][0] != null
            }).length == 0;
    }

    removeHttp(url) {
        const re = /\s*http[s]?:\/\//g;
        return url.replace(re, '');
    }

    handleChangeTitle(event) {
        this.setState({title: event.target.value});
    }

    handleChangeType(e, eventKey) {

        let newState = {matchType: eventKey};

        // pri vsetkych typoch okrem BULK orezeme mnozstvo hladanych vyrazov na 1
        if (eventKey != HeatmapUtils.TYPE_BULK) {
            newState.matchStrings = this.state.matchStrings.slice(0, 1);
        }

        this.setState(newState);
    }

    handleChangeStatus(event) {
        this.setState({status: event.target.getAttribute('data-status')});
    }

    handleChangeMatchString(event) {
        let {matchStrings} = this.state,
            id = event.target.getAttribute('data-id');

        // matchStrings[id] = this.removeHttp(event.target.value.trim());
        matchStrings[id] = event.target.value.trim();

        this.setState({matchStrings: matchStrings});
    }

    handleChangeSnapshotUrl(event) {
        // this.setState({snapshotUrl: this.removeHttp(event.target.value.trim())});
        this.setState({snapshotUrl: event.target.value.trim()});
    }

    renderFlashMessages() {
        if (this.state.flashMessage.text.trim().length == 0) {
            return '';
        }

        return (
            <Row>
                <Col sm={10} smPush={1}>
                    <Alert bsStyle={this.state.flashMessage.type}>
                        {this.state.flashMessage.text}
                    </Alert>
                </Col>
            </Row>
        );
    }

    renderConfigurationTitle() {

        let {errors, title} = this.state,
            onChange = this.handleChangeTitle;

        return (
            <Row>
                <Col sm={3}>
                    <div className="text-right">Title:</div>
                </Col>
                <Col sm={8}>
                    <Input type="text" name="heatmap_title" placeholder="Title ..."
                           value={title} onChange={onChange} bsStyle={errors.title[0]} help={errors.title[1]}/>
                </Col>
            </Row>
        )
    }

    renderMatchTypeSelectbox() {

        let {errors, matchType} = this.state,
            title = HeatmapUtils.type(matchType),
            onSelect = this.handleChangeType,
            error = errors.matchType[1].length != 0 ? (<span className="help-block">{errors.matchType[1]}</span>) : '',
            items;

        items = [
            HeatmapUtils.TYPE_FULL_URL,
            HeatmapUtils.TYPE_START_WITH,
            HeatmapUtils.TYPE_REGEX,
            HeatmapUtils.TYPE_BULK
        ].map((type, i) => {
            return (<MenuItem key={i} eventKey={type}>{HeatmapUtils.type(type)}</MenuItem>);
        });

        return (
            <Row>
                <Col sm={3}>
                    <div className="text-right">Typ:</div>
                </Col>
                <Col sm={8} className={errors.matchType[0] != null ? 'has-error' : ''}>
                    <DropdownButton block id="match-type" title={title} onSelect={onSelect} className="form-control">
                        {items}
                    </DropdownButton>
                    {error}
                </Col>
            </Row>
        )
    }

    renderStatusButton() {
        let statuses = {};
        statuses[HeatmapUtils.STATUS_ACTIVE] = 'Active';
        statuses[HeatmapUtils.STATUS_PAUSED] = 'Paused';
        statuses[HeatmapUtils.STATUS_FINISHED] = 'Finished';

        let html = Object.keys(statuses).map((status, i) => {
            let active = false;
            if (status == this.state.status) {
                active = true;
            }
            return (
                <Button small key={i} active={active} onClick={this.handleChangeStatus.bind(this)}
                        data-status={status}>{statuses[status]}</Button>
            )
        });

        return (
            <Row>
                <Col sm={3}>
                    <div className="text-right">Status:</div>
                </Col>
                <Col sm={8}><ButtonGroup>{html}</ButtonGroup></Col>
            </Row>
        )
    }

    renderMatchStrings() {
        let {errors, matchStrings, matchType} = this.state,
            onChange = this.handleChangeMatchString,
            inputs,
            addUrl;

        addUrl = ()=> {
            this.setState({matchStrings: [...matchStrings, '']});
        };

        if (matchStrings.length == 0) {
            matchStrings.push('');
        }

        inputs = matchStrings.map((val, i)=> {

            let addButton = '';
            if (matchType == HeatmapUtils.TYPE_BULK && i == matchStrings.length - 1) {
                addButton = (
                    <Button onClick={addUrl}>
                        <span className='glyphicon glyphicon-plus'/>
                    </Button>
                );
            }

            return (
                <Input key={i} type="text" data-id={i} value={val} placeholder="url ..."
                       buttonAfter={addButton} onChange={onChange} bsStyle={errors.matchStrings[0]}
                       help={errors.matchStrings[1]}/>
            )
        });


        return (
            <Row>
                <Col sm={3}>
                    <div className="text-right">Url:</div>
                </Col>
                <Col sm={8} className="match-strings">
                    {inputs}
                </Col>
            </Row>
        );
    }

    renderSnapshotUrl() {

        let {matchType, errors, snapshotUrl} = this.state,
            onChange = this.handleChangeSnapshotUrl;

        switch (matchType) {
            case HeatmapUtils.TYPE_START_WITH:
            case HeatmapUtils.TYPE_REGEX:
            case HeatmapUtils.TYPE_BULK:
                return (
                    <Row>
                        <Col sm={3}>
                            <div className="text-right">Snapshot url:</div>
                        </Col>
                        <Col sm={8}>
                            <Input type="text" placeholder="Snapshot url ..." value={snapshotUrl}
                                   onChange={onChange} bsStyle={errors.snapshotUrl[0]} help={errors.snapshotUrl[1]}/>
                        </Col>
                    </Row>
                );
            case HeatmapUtils.TYPE_UNDEFINED:
            default:
                return (<div></div>);
        }
    }

    render() {

        let {visible, id} = this.state,
            title = id == HeatmapUtils.UNDEFINED_ID
                ? 'New configuration ...'
                : 'Edit configuration ...';

        return (
            <Modal show={visible} onHide={this.close} className="heatmap-settings-modal" backdrop={true} bsSize="lg">
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {this.renderFlashMessages()}
                    {this.renderConfigurationTitle()}
                    {this.renderMatchTypeSelectbox()}
                    {this.renderMatchStrings()}
                    {this.renderSnapshotUrl()}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.save} bsStyle="success">Save</Button>
                    <Button onClick={this.close}>Close</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state) {
    return {
        heatmaps: state.heatmaps.heatmaps
    };
}

export default connect(mapStateToProps)(SettingsModal);