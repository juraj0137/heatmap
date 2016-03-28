import "./heatmap-detail.less";
import heatmapRenderer from "heatmap.js";
import React from "react";
import jquery from "jquery";
import { connect } from 'react-redux';
import {TreeStructureDetailed} from  "./../../client/dataColect/TreeStructureDetailed.js";
import {setHeight, setWidth} from './../detail/actions.js';
import {getHeatmap} from './../list/actions.js';

import HeatmapSettings from './../components/detail/HeatmapSettings.react.js';

class ViewDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mouseMovementsRaw: null,
            mouseMovementsProcessed: null,
            mouseClicks: null
        };

        this.loadData();
        this.heatmap = null;

        this.renderHeatmap = this.renderHeatmap.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(setWidth(1200));
        this.props.dispatch(setHeight(660));
        this.props.dispatch(getHeatmap('AVOX9lB9x1j1Wq6RKKna'));
    }

    loadData() {

    }

    processHeatmapData() {
        var iframe = this.refs['page'].getElementsByTagName('iframe')[0];
        var doc = (iframe.contentWindow || iframe.contentDocument);
        if (doc.document) {
            doc = doc.document;
        }

        if (this.heatmap == null) {
            if (typeof heatmapRenderer == "object") {
                this.heatmap = heatmapRenderer.create({
                    container: doc.getElementsByTagName('body')[0],
                    opacity: this.props.detail.heatmapOpacity,
                    radius: this.props.detail.heatmapRadius,
                    blur: this.props.detail.heatmapBlur
                });
            }
        }

        return this.state.mouseMovementsRaw.getDataForHeatmap(doc)
    }

    renderHeatmap() {

        let heatmapData = this.processHeatmapData();

        this.setState({
            mouseMovementsProcessed: heatmapData
        });

        if (typeof this.heatmap == "object") {
            this.heatmap.setData({
                max: heatmapData.max,
                min: heatmapData.min,
                data: heatmapData.points
            });
        }
    }

    componentWillReceiveProps(nextProps) {

        let {heatmapRadius, heatmapBlur, heatmapOpacity} = nextProps.detail;
        let {heatmap} = this;

        if (heatmap != null) {
            if (this.props.detail.heatmapRadius !== heatmapRadius) {
                heatmap._store._cfgRadius = heatmapRadius;
                let heatmapData = this.state.mouseMovementsProcessed;
                heatmap.setData({
                    max: heatmapData.max,
                    min: heatmapData.min,
                    data: heatmapData.points
                });
            }
            if (this.props.detail.heatmapBlur !== heatmapBlur || this.props.detail.heatmapOpacity !== heatmapOpacity) {
                heatmap._renderer._templates = {};
                heatmap.configure({
                    opacity: heatmapOpacity,
                    blur: heatmapBlur
                });
            }
        }
    }

    render() {

        let iframeCss = {
            width: this.props.detail.heatmapWidth,
            height: this.props.detail.heatmapHeight
        };

        return (
            <div className="heatmap-detail">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Deail heat mapy</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <HeatmapSettings onRefreshButtonClick={this.renderHeatmap}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 iframe-wrapper" ref="page">
                        <iframe src="/api/scrapper?url=http://aktuality.sk" style={iframeCss}></iframe>
                    </div>
                </div>
            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        detail: state.heatmapDetail
    };
}

export default connect(mapStateToProps)(ViewDetail);