import "./heatmap-detail.less";
import heatmapRenderer from "heatmap.js";
import React from "react";
import {ProgressBar} from "react-bootstrap";
import jquery from "jquery";
import { connect } from 'react-redux';
import {HeatmapUtils} from "./../../common/utils.js";
import {TreeStructureDetailed} from  "./../../client/dataColect/TreeStructureDetailed.js";
import {setHeight, setWidth, setConfig, getHeatmapDataIfNeeded} from './../detail/actions.js';
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
            pageLoaded: false,
            heatmapRendered: false
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
            this.loadHeatmapData(heatmapConfig.id);
        }
    }

    loadHeatmapData(heatmapId) {
        if (heatmapId != undefined && this.props.detail.mouseMovements == null) {
            this.props.dispatch(getHeatmapDataIfNeeded(heatmapId));
        }
    }

    componentDidMount() {
        this.props.dispatch(setWidth(1200));
        this.props.dispatch(setHeight(660));

        this.handleOnPageLoad();
    }

    handleOnPageLoad() {
        var iframe = this.refs['page'].getElementsByTagName('iframe')[0];
        iframe.addEventListener("load", () => {

            var doc = (iframe.contentWindow || iframe.contentDocument);
            if (doc.document) {
                doc = doc.document;
            }

            let coockieBar = doc.getElementById('aboutCookieUsageBox');
            if (coockieBar) {
                coockieBar.parentNode.removeChild(coockieBar);
            }

            this.initHeatmapObject(doc);
            if (this.props.detail.mouseMovements != null) {
                this.renderHeatmap();
            }
            this.setState({pageLoaded: true});
        });
    }

    initHeatmapObject(document) {
        if (this.heatmap == null) {
            if (typeof heatmapRenderer == "object") {
                this.heatmap = heatmapRenderer.create({
                    container: document.getElementsByTagName('body')[0],
                    radius: this.props.detail.heatmapRadius,
                    blur: this.props.detail.heatmapBlur,
                    maxOpacity: this.props.detail.heatmapOpacityMax,
                    minOpacity: this.props.detail.heatmapOpacityMin
                });
            }
        }
    }

    processHeatmapData() {
        var iframe = this.refs['page'].getElementsByTagName('iframe')[0];
        var doc = (iframe.contentWindow || iframe.contentDocument);
        if (doc.document) {
            doc = doc.document;
        }
        return this.props.detail.mouseMovements.getDataForHeatmap(doc)
    }

    renderHeatmap() {

        let heatmapData = this.processHeatmapData();

        console.log(heatmapData);

        if (this.heatmap != null) {
            this.heatmap.setData({
                max: heatmapData.max,
                min: heatmapData.min,
                data: heatmapData.points
            });
        }

        this.setState({
            mouseMovementsProcessed: heatmapData,
            heatmapRendered: true
        });
    }

    componentWillReceiveProps(nextProps) {

        let {heatmapRadius, heatmapBlur, heatmapOpacityMax,heatmapOpacityMin } = nextProps.detail;
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
            if (this.props.detail.heatmapBlur !== heatmapBlur ||
                this.props.detail.heatmapOpacityMax !== heatmapOpacityMax ||
                this.props.detail.heatmapOpacityMin !== heatmapOpacityMin) {
                heatmap._renderer._templates = {};
                heatmap.configure({
                    minOpacity : heatmapOpacityMin,
                    maxOpacity : heatmapOpacityMax,
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
                this.loadHeatmapData(config.id);
            }
        }

        if (this.props.detail.mouseMovements != null && this.state.heatmapRendered == false) {
            this.renderHeatmap();
        }
    }

    renderLoadingBar() {
        let max = 4,
            act = 0,
            style = 'info';

        if (this.props.detail.heatmapConfig != null) {
            act++;
        }

        if (this.props.detail.mouseMovements != null) {
            act++;
        }

        if (this.heatmap != null) {
            act++;
        }

        if (this.state.heatmapRendered == true) {
            act++;
        }

        if(max == act){
            style = 'success';
            setTimeout(()=>{
                this.refs['loadingBar'].style.display = 'none'
            }, 1500);
        }

        return (
            <div className="row" ref="loadingBar">
                <ProgressBar active bsStyle={style} now={Math.round((act/max)*100)} label="Načítavam"/>
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