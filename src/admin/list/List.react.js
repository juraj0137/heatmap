import './heatmap-list.less';
import React from "react";
import {Link} from "react-router";
import dateformat from "dateformat";
import { connect } from 'react-redux';
import {Button, Table, OverlayTrigger, Popover} from "react-bootstrap";

import FlashMessage, {TYPE_SUCCESS, TYPE_ERROR} from './../../common/model/flashMessage';
import {HeatmapUtils} from './../../common/utils';
import {addFlashmessage,removeFlashmessage} from './../app/actions';
import SettingsModal from "./../components/settings/SettingsModal.react.js";
import Heatmap, { STATUS_ACTIVE, STATUS_FINISHED, STATUS_PAUSED, UNDEFINED_ID} from './../../common/model/heatmap.js';
import {fetchHeatmaps, updateHeatmap} from './actions.js';


class ViewList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            heatmapModalVisible: false,
            editedHeatmap: new Heatmap()
        };

        this.editHeatmap = this.editHeatmap.bind(this);
        this.openHeatmapModal = this.openHeatmapModal.bind(this);
        this.closeHeatmapModal = this.closeHeatmapModal.bind(this);
    }

    componentDidMount() {
        let {lastReload} = this.props.heatmaps;
        if (lastReload == null || ((new Date() - lastReload) > 10 * 60 * 1000)) {
            this.fetchHeatmaps();
        }
    }

    fetchHeatmaps() {
        let {dispatch} = this.props;

        let loadMsg = new FlashMessage({
            id: HeatmapUtils.uuid(),
            text: 'Načítavam data ...'
        });
        dispatch(addFlashmessage(loadMsg));

        let fetchSuccess = ()=> {
            dispatch(removeFlashmessage(loadMsg));
            dispatch(addFlashmessage(new FlashMessage({
                text: 'Data načítané ...',
                type: TYPE_SUCCESS,
                dismissAfter: 2000
            })));
        };

        let fetchError = ()=> {
            dispatch(removeFlashmessage(loadMsg));
            let errorMsg = new FlashMessage({
                html: (
                    <span>
                        Nastala chyba pri načitávaní dát.
                        <a onClick={()=>{
                            dispatch(fetchHeatmaps());
                            dispatch(removeFlashmessage(errorMsg));
                        }}>Pokúsiť sa načítať data znovu!</a>
                    </span>
                ),
                type: TYPE_ERROR
            });
            dispatch(addFlashmessage(errorMsg));
        };

        dispatch(fetchHeatmaps(fetchSuccess, fetchError));
    }

    openHeatmapModal() {
        this.setState({
            editedHeatmap: new Heatmap(),
            heatmapModalVisible: true
        });
    }

    closeHeatmapModal() {
        this.setState({heatmapModalVisible: false});
    }

    editHeatmap(heatmap) {
        this.setState({
            editedHeatmap: heatmap,
            heatmapModalVisible: true
        });
    }

    renderTable() {
        return (
            <Table hover className="heatmap-list">
                <thead>
                <tr>
                    <th className="col-order">#</th>
                    <th className="col-status text-center">Status</th>
                    <th>Názov</th>
                    <th className="col-pageviews text-center">Pageviews</th>
                    <th className="col-time text-center">Vytvorené</th>
                    <th className="col-actions">Akcie</th>
                </tr>
                </thead>
                <tbody>
                {this.renderTableRows()}
                </tbody>
            </Table>
        );
    }

    //@todo refactor
    renderTableRows() {
        return this.props.heatmaps.heatmaps.filter((item)=> {
            return item instanceof Heatmap;
        }).map((item, i)=> {

            let self = this,
                status = '',
                bgStyle = '',
                statusButton = '';

            const changeState = (e) => {
                let status = e.target.getAttribute('data-type'),
                    id = e.target.getAttribute('data-heatmap-id'),
                    editHeatmap = this.props.heatmaps.filter(item => {
                        return item.id == id;
                    })[0];

                if (editHeatmap != undefined) {
                    editHeatmap = editHeatmap.set('status', status);

                    let {dispatch} = this.props,
                        updateMsg = new FlashMessage({
                            id: HeatmapUtils.uuid(),
                            text: 'Ukadám data ...'
                        });

                    dispatch(addFlashmessage(updateMsg));

                    let updateSuccess = ()=> {
                            dispatch(removeFlashmessage(updateMsg));
                        },
                        updateFailed = ()=> {
                            dispatch(removeFlashmessage(updateMsg));
                            let errorMsg = new FlashMessage({
                                text: 'Nastala chyba pri aktualizovaní dát, skúste neskôr prosím',
                                type: TYPE_ERROR
                            });
                            dispatch(addFlashmessage(errorMsg));
                        };
                    dispatch(updateHeatmap(editHeatmap, updateSuccess, updateFailed));

                }
            };

            switch (item.status) {
                case STATUS_ACTIVE:
                    status = 'Aktívna';
                    statusButton = (
                        <Button bsStyle="info" bsSize="small" data-type={STATUS_PAUSED} data-heatmap-id={item.id}
                                onClick={changeState.bind(item)}>Pozastaviť</Button>);
                    bgStyle = 'success';
                    break;
                case STATUS_FINISHED:
                    status = 'Ukončená';
                    bgStyle = 'warning';
                    break;
                case STATUS_PAUSED:
                    status = 'Pozastavená';
                    statusButton = (
                        <Button bsStyle="info" bsSize="small" data-type={STATUS_ACTIVE} data-heatmap-id={item.id}
                                onClick={changeState.bind(this)}>Pokračovať</Button>);
                    bgStyle = 'info';
                    break;
            }

            let matchStrings = '';
            if (item.matchStrings.length > 1) {
                matchStrings = (
                    <div>
                        {item.matchStrings[0]},
                        <OverlayTrigger trigger="click" placement="right"
                                        overlay={<Popover id={i} title="Všetky sledované url ..">{item.matchStrings.map((item, i) => {
                                            return (<div key={i}>{item}</div>)
                                        })}</Popover>}>
                            <a>všetky...</a>
                        </OverlayTrigger>
                    </div>
                );
            } else {
                matchStrings = item.matchStrings[0];
            }

            return (
                <tr key={i} className={bgStyle} data-heatmap-id={item.id}>
                    <td>{i + 1}.</td>
                    <td className="text-center">{status}</td>
                    <td>
                        <div className="heatmap-title">{item.title}</div>
                        <div className="heatmap-match-string">{matchStrings}</div>
                    </td>
                    <td className="text-center">{item.pageViews}</td>
                    <td className="text-center">{dateformat(item.created.toString(), "dd.mm.yyyy - h:MM")}</td>
                    <td>
                        <Link to={`/detail/${item.id}`}>
                            <Button bsStyle="success" bsSize="small">
                                Zobraziť
                            </Button>
                        </Link>
                        {statusButton}
                        <Button bsStyle="warning" bsSize="small" onClick={()=>{self.editHeatmap(item)}}>Upraviť</Button>
                    </td>
                </tr>
            );
        }).slice(0, 10);
    }

    render() {

        const cssButton = {
            position: 'absolute',
            bottom: '40px',
            right: '10px'
        };

        let {heatmapModalVisible, editedHeatmap} = this.state,
            onModalHide = this.closeHeatmapModal;

        return (
            <div className="heatmap-list">
                <SettingsModal show={heatmapModalVisible} editedHeatmap={editedHeatmap} onHide={onModalHide}/>
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Zoznam heat máp</h1>
                        <Button bsStyle="success" style={cssButton} onClick={this.openHeatmapModal}>
                            Pridať heat mapu
                        </Button>
                    </div>
                </div>
                <div className="row">
                    {this.renderTable()}
                </div>
            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        heatmaps: state.heatmaps
    };
}

export default connect(mapStateToProps)(ViewList);