import "./settings.less";
import React from "react";
import { connect } from 'react-redux';
import {Input, ButtonGroup, Button} from "react-bootstrap";

import {setHeight, setWidth, setViewTypeClicks, setViewTypeMovements, VIEW_TYPE_CLICKS, VIEW_TYPE_MOVEMENTS} from './../../detail/actions.js';

class HeatmapSettings extends React.Component {

    constructor(props) {
        super(props);

        this.handleWidthChange = this.handleWidthChange.bind(this);
        this.handleHeightChange = this.handleHeightChange.bind(this);
        this.handleChangeViewType = this.handleChangeViewType.bind(this);
        this.handleRefreshHeatmap = this.handleRefreshHeatmap.bind(this);
    }

    handleWidthChange(event) {
        let width = parseInt(event.target.value.trim());
        if (!isNaN(width)) {
            this.props.dispatch(setWidth(width));
        }
    }

    handleHeightChange(event) {
        let height = parseInt(event.target.value.trim());
        if (!isNaN(height)) {
            this.props.dispatch(setHeight(height));
        }
    }

    handleChangeViewType(event) {
        switch (event.target.getAttribute('data-type')) {
            case VIEW_TYPE_CLICKS:
                this.props.dispatch(setViewTypeClicks());
                break;
            case VIEW_TYPE_MOVEMENTS:
            default:
                this.props.dispatch(setViewTypeMovements());
        }
    }

    handleRefreshHeatmap(){
        this.props.onRefreshButtonClick.call(this);
    }

    render() {

        return (
            <div className="heatmap-detail-settings-toolbar">
                <div className="heatmap-dimensions">
                    <label className="pull-left">
                        Rozmery:
                    </label>
                    <Input className="width" type="number" step="10" addonAfter="px" value={this.props.heatmapWidth}
                           onChange={this.handleWidthChange}/>
                    <span className="separator">x</span>
                    <Input className="height" type="number" step="10" addonAfter="px" value={this.props.heatmapHeight}
                           onChange={this.handleHeightChange}/>
                    <div className="clearfix"></div>
                </div>
                <div className="heatmap-type">
                    <label className="pull-left">
                        Typ heatmapy:
                    </label>
                    <ButtonGroup>
                        <Button active={this.props.viewType == VIEW_TYPE_MOVEMENTS} data-type={VIEW_TYPE_MOVEMENTS}
                                onClick={this.handleChangeViewType}>Pohyb</Button>
                        <Button active={this.props.viewType == VIEW_TYPE_CLICKS} data-type={VIEW_TYPE_CLICKS} disabled
                                onClick={this.handleChangeViewType}>Klikanie</Button>
                    </ButtonGroup>
                </div>
                <Button bsStyle="success" className="show-heatmap" onClick={this.handleRefreshHeatmap}>Aktualizuj heatmapu</Button>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return state.heatmapDetail
}

export default connect(mapStateToProps)(HeatmapSettings);