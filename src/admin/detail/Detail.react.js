import "./heatmap-detail.less";
import heatmapRenderer from "heatmap.js";
import React from "react";
import {ProgressBar} from "react-bootstrap";
import jquery from "jquery";
import { connect } from 'react-redux';
import {HeatmapUtils} from "./../../common/utils.js";
import {TreeStructureDetailed} from  "./../../client/dataColect/TreeStructureDetailed.js";
import {setHeight, setWidth, setConfig} from './../detail/actions.js';
import {getHeatmap} from './../list/actions.js';

import HeatmapSettings from './../components/detail/HeatmapSettings.react.js';

class ViewDetail extends React.Component {

    constructor(props) {
        super(props);

        let self = this;

        this.state = {
            mouseMovementsRaw: null,
            mouseClicksRaw: null,
            mouseMovementsProcessed: null,
            mouseClicksProcessed: null,
            pageLoad: false
        };
        this.heatmap = null;

        this.loadHeatmapConfig();

        this.renderHeatmap = this.renderHeatmap.bind(this);
        this.loadHeatmapConfig = this.loadHeatmapConfig.bind(this);
    }

    loadHeatmapConfig() {
        let heatmapConfig = this.props.heatmaps.filter(item => {
            return item.id == this.props.params.id; //this.props.params.id is from url
        }).pop();

        if (heatmapConfig == undefined) {
            this.props.dispatch(getHeatmap(this.props.params.id));
        } else {
            this.props.dispatch(setConfig(heatmapConfig));
        }
    }

    componentDidMount() {
        this.props.dispatch(setWidth(1200));
        this.props.dispatch(setHeight(660));

        this.loadData();
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

        // zmena configu heatmapy (blur, radius, opacity)
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

        // ak nemame nastaveny zakladnu konfiguraciu heatmapy, pokusime sa ju najst a nastavit
        if (this.props.detail.heatmapConfig == null) {
            let config = nextProps.heatmaps.filter(item => {
                return item.id == nextProps.params.id; //this.props.params.id is from url
            }).pop();
            if (config !== undefined) {
                nextProps.dispatch(setConfig(config));
            }
        }
    }

    renderLoadingBar() {
        let max = 3,
            act = 0;

        if (this.props.detail.heatmapConfig != null) {
            act++;
        }

        return (
            <div className="row">
                <ProgressBar now={Math.round((act/max)*100)} label="Načítavam"/>
            </div>
        )
    }

    renderIframe() {
        let iframeCss = {
                width: this.props.detail.heatmapWidth,
                height: this.props.detail.heatmapHeight
            },
            scrapperUrl = this.props.detail.heatmapConfig != null ? this.props.detail.heatmapConfig.snapshotUrl : '',
            re = /^(http[s]*:\/\/)/;

        if (scrapperUrl.length > 0 && re.test(scrapperUrl) === false) {
            scrapperUrl = 'http://' + scrapperUrl;
        }

        return (
            <div className="row">
                <div className="col-lg-12 iframe-wrapper" ref="page">
                    <iframe src={`/api/scrapper?snapshotUrl=${scrapperUrl}`} style={iframeCss}></iframe>
                </div>
            </div>
        )
    }


    render() {
        let heatmapTitle = this.props.detail.heatmapConfig != null ? this.props.detail.heatmapConfig.title : '';

        return (
            <div className="heatmap-detail">
                <div className="row">
                    <div className="col-lg-12">
                        <h1 className="page-header">Deail heat mapy <b>{heatmapTitle}</b></h1>
                    </div>
                </div>
                {this.renderLoadingBar()}
                <div className="row">
                    <div className="col-lg-12">
                        <HeatmapSettings onRefreshButtonClick={this.renderHeatmap}/>
                    </div>
                </div>
                {this.renderIframe()}

            </div>
        );
    }

}


function mapStateToProps(state) {
    return {
        detail: state.heatmapDetail,
        heatmaps: state.heatmaps.heatmaps
    };
}

export default connect(mapStateToProps)(ViewDetail);