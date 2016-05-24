import './heatmap-list.less';
import React from "react";
import {Link} from "react-router";
import dateformat from "dateformat";
import {connect} from 'react-redux';
import Diacritics from 'diacritic';
import {Button, Table, OverlayTrigger, Popover, Input} from "react-bootstrap";

import FlashMessage, {TYPE_SUCCESS, TYPE_ERROR} from './../components/flashMessages/flashMessage';
import {addFlashmessage, removeFlashmessage} from './../app/actions';
import SettingsModal from "./../components/settings/SettingsModal.react.js";
import Heatmap from './../../server/db/model/heatmap.js';
import {fetchHeatmaps} from './actions.js';


class ViewList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            heatmapModalVisible: false,
            editedHeatmap: new Heatmap(),
            filter: {
                text: ''
            }
        };

        this.editHeatmap = this.editHeatmap.bind(this);
        this.handleFilterText = this.handleFilterText.bind(this);
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
            id: Math.round(Math.random() * 10000),
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
            <Table hover striped className="heatmap-list">
                <thead>
                <tr>
                    <th className="col-order">#</th>
                    <th>Názov</th>
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

    renderTableRows() {
        return this.props.heatmaps.heatmaps
            .filter((item)=> {
                if ((item instanceof Heatmap) == false)
                    return false;

                let {text} = this.state.filter;
                text = Diacritics.clean(text.toLowerCase().trim());
                if (text.length > 0) {
                    try {

                        if (Diacritics.clean(item.title).toLowerCase().trim().match(text)) {
                            return true;
                        }

                        return item.matchStrings.filter((matchString)=> {
                                return Diacritics.clean(matchString).toLowerCase().trim().match(text)
                            }).length > 0;
                    } catch (e) {
                        return true
                    }
                }
                return true;
            })
            .sort((a, b)=> new Date(b.created) - new Date(a.created))
            .map((item, i)=> {

                let self = this,
                    status = '',
                    bgStyle = '',
                    statusButton = '';

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
                        <td>
                            <div className="heatmap-title">{item.title}</div>
                            <div className="heatmap-match-string">{matchStrings}</div>
                        </td>
                        <td className="text-center">{dateformat(item.created.toString(), "dd.mm.yyyy - HH:MM")}</td>
                        <td>
                            <Link to={`/detail/${item.id}`}>
                                <Button bsStyle="success" bsSize="small">
                                    Zobraziť
                                </Button>
                            </Link>
                            <Button bsStyle="warning" bsSize="small"
                                    onClick={()=>{self.editHeatmap(item)}}>Upraviť</Button>
                        </td>
                    </tr>
                );
            })
            .slice(0, 20);
    }

    handleFilterText(event) {
        this.setState({
            filter: {
                text: event.target.value
            }
        })
    }

    render() {

        let {heatmapModalVisible, editedHeatmap} = this.state,
            onModalHide = this.closeHeatmapModal;

        return (
            <div className="heatmap-list">
                <SettingsModal show={heatmapModalVisible} editedHeatmap={editedHeatmap} onHide={onModalHide}/>
                <div className="row">
                    <div className="col-lg-12 page-header row">
                        <div className="col-lg-4">
                            <h1 className="pull-left">Zoznam heat máp</h1>
                        </div>
                        <div className="col-lg-4">
                            <Input className="filter-text" type="text" value={this.state.filter.text}
                                   onChange={this.handleFilterText} placeholder="Filter ..."/>
                        </div>
                        <div className="col-lg-4">
                            <Button bsStyle="success" onClick={this.openHeatmapModal}>Pridať heat mapu</Button>
                        </div>
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