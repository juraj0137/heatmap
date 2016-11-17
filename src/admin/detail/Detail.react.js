import "./heatmap-detail.less";
import heatmapRenderer from "heatmap.js";
import React from "react";
import ReactDOM from "react-dom";
import {ProgressBar} from "react-bootstrap";
import {connect} from 'react-redux';
import {
    setHeight,
    setWidth,
    setConfig,
    getHeatmapDataIfNeeded,
    resetHeatmapData,
    cropSetParams,
    VIEW_TYPE_MOVEMENTS
} from './../detail/actions.js';
import {getHeatmap} from './../list/actions.js';

import HeatmapSettings from '../components/detail/HeatmapSettings.js';
import Cropper from '../components/detail/Cropper.js';

class ViewDetail extends React.Component {

    constructor(props) {
        super(props);

        let self = this;

        this.state = {
            heatmapData: null,
            pageLoaded: false,
            heatmapRendered: false,
            fullscreen: false
        };
        this.heatmap = null;

        this.resizeWindow = this.resizeWindow.bind(this);
        this.renderHeatmap = this.renderHeatmap.bind(this);
        this.loadHeatmapConfig = this.loadHeatmapConfig.bind(this);
        this.onFullscreenToggle = this.onFullscreenToggle.bind(this);
    }


    componentDidMount() {
        console.log('load - componentDidMount');

        setTimeout(()=> {
            this.resizeWindow();
        }, 5);

        this.loadHeatmapConfig();
        this.handleOnPageLoad();

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
        if (heatmapId != undefined && this.props.detail.heatmapData == null) {
            this.props.dispatch(getHeatmapDataIfNeeded(heatmapId));
        }
    }

    resizeWindow() {
        let width = ReactDOM.findDOMNode(this).clientWidth - 20;
        let detailHeight = ReactDOM.findDOMNode(this).clientHeight;
        let headerHeight = document.getElementsByClassName('page-header')[0].parentElement.clientHeight;
        let progressHeight = document.getElementsByClassName('progress')[0].parentElement.clientHeight;
        let settingsHeight = document.getElementsByClassName('heatmap-detail-settings-toolbar')[0].parentElement.clientHeight;
        let height = detailHeight - headerHeight - progressHeight - settingsHeight - 6;
        if (this.state.fullscreen) {
            height = document.getElementsByClassName('iframe-bgr')[0].clientHeight - 6;
            console.log(document.getElementsByClassName('iframe-bgr'));
        }
        this.props.dispatch(setWidth(width));
        this.props.dispatch(setHeight(height));
    }

    componentWillUnmount() {
        this.props.dispatch(resetHeatmapData());
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

            setTimeout(()=> {
                this.initHeatmapObject(doc);
                if (this.props.detail.heatmapData != null) {
                    this.renderHeatmap();
                }
                this.setState({pageLoaded: true});
            }, 50);
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
                document.getElementsByClassName('heatmap-canvas')[0].style.zIndex = 100000;
            }
        }
    }

    processHeatmapData() {
        var iframe = this.refs['page'].getElementsByTagName('iframe')[0];
        var doc = (iframe.contentWindow || iframe.contentDocument);
        if (doc.document) {
            doc = doc.document;
        }
        return this.props.detail.heatmapData.getDataForRender(doc)
    }

    renderHeatmap(type) {
        let heatmapData = this.processHeatmapData();

        if (this.heatmap != null) {
            type = type == undefined ? this.props.detail.viewType : type;
            this.heatmap.setData({
                max: type == VIEW_TYPE_MOVEMENTS ? heatmapData.maxMovements : heatmapData.maxClicks,
                min: type == VIEW_TYPE_MOVEMENTS ? heatmapData.minMovements : heatmapData.minClicks,
                data: type == VIEW_TYPE_MOVEMENTS ? heatmapData.movements : heatmapData.clicks
            });
        }

        this.setState({
            heatmapData: heatmapData,
            heatmapRendered: true
        });
    }

    componentWillReceiveProps(nextProps) {

        let {viewType} = nextProps.detail;
        let {heatmap} = this;

        this.handleBlurOpacitRadius(nextProps);
        this.handleCrop(nextProps);

        // ak nemame nastavenu zakladnu konfiguraciu heatmapy, pokusime sa ju najst a nastavit
        if (this.props.detail.heatmapConfig == null) {
            let config = nextProps.heatmaps.filter(item => {
                return item.id == nextProps.params.id; //this.props.params.id is from url
            }).pop();
            if (config !== undefined) {
                nextProps.dispatch(setConfig(config));
                this.loadHeatmapData(config.id);
            }
        }

        if (this.props.detail.viewType != viewType) {
            this.renderHeatmap(viewType);
        }

        if (this.props.detail.heatmapData != null && this.state.heatmapRendered == false) {
            this.renderHeatmap();
        }
    }

    handleCrop(nextProps) {

        let {enable, x, y, width, height} = nextProps.detail.crop;
        let heatmapData = this.state.heatmapData;
        let type = this.props.detail.viewType;

        if (this.props.detail.crop.enable == true && enable == false) {
            this.heatmap.setData({
                max: type == VIEW_TYPE_MOVEMENTS ? heatmapData.maxMovements : heatmapData.maxClicks,
                min: type == VIEW_TYPE_MOVEMENTS ? heatmapData.minMovements : heatmapData.minClicks,
                data: type == VIEW_TYPE_MOVEMENTS ? heatmapData.movements : heatmapData.clicks
            });
        }

        if (enable == false || this.props.detail.crop.enable == false)
            return;

        let data = type == VIEW_TYPE_MOVEMENTS ? heatmapData.movements : heatmapData.clicks;
        data = data.filter((item)=> {
            return (x < item.x && item.x < x + width && y < item.y && item.y < y + height)
        });

        let minMax = data.reduce((acc, item)=> {
            acc.min = Math.min(item.value, acc.min);
            acc.max = Math.max(item.value, acc.max);
            return acc;
        }, {min: 9999999, max: 0});

        this.heatmap.setData({
            max: minMax.max,
            min: minMax.min,
            data: data
        });
    }

    handleBlurOpacitRadius(nextProps) {
        let {heatmapRadius, heatmapBlur, heatmapOpacityMax, heatmapOpacityMin} = nextProps.detail;
        let {heatmap} = this;

        // zmena configu heatmapy (blur, radius, opacity)
        if (heatmap != null) {
            if (this.props.detail.heatmapRadius !== heatmapRadius) {
                heatmap._store._cfgRadius = heatmapRadius;
                let heatmapData = this.state.heatmapData;
                let type = this.props.detail.viewType;
                heatmap.setData({
                    max: type == VIEW_TYPE_MOVEMENTS ? heatmapData.maxMovements : heatmapData.maxClicks,
                    min: type == VIEW_TYPE_MOVEMENTS ? heatmapData.minMovements : heatmapData.minClicks,
                    data: type == VIEW_TYPE_MOVEMENTS ? heatmapData.movements : heatmapData.clicks
                });
            }
            if (this.props.detail.heatmapBlur !== heatmapBlur ||
                this.props.detail.heatmapOpacityMax !== heatmapOpacityMax ||
                this.props.detail.heatmapOpacityMin !== heatmapOpacityMin) {
                heatmap._renderer._templates = {};
                heatmap.configure({
                    minOpacity: heatmapOpacityMin,
                    maxOpacity: heatmapOpacityMax,
                    blur: heatmapBlur
                });
            }
        }
    }

    renderLoadingBar() {
        let max = 4,
            act = 0,
            style = 'info';

        if (this.props.detail.heatmapConfig != null) {
            act++;
        }

        if (this.props.detail.heatmapData != null) {
            act++;
        }

        if (this.heatmap != null) {
            act++;
        }

        if (this.state.heatmapRendered == true) {
            act++;
        }

        if (max == act) {
            style = 'success';
            setTimeout(()=> {
                this.refs['loadingBar'].style.display = 'none';
                if (this.a == undefined) {
                    this.resizeWindow();
                    this.a = 'a';
                }
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

        let bgrStyle = this.state.fullscreen ? {position: 'absolute', top: 0, left: 0, zIndex: 1000} : {};
        let fullscreenBtnStyle = !this.state.fullscreen ? {display: 'none'} : {};

        let onCropChange = (data) => {
            let canvasBox = this.heatmap._config.container.getBoundingClientRect();
            data.y = Math.abs(canvasBox.top) + data.y;
            this.props.dispatch(cropSetParams(data.x, data.y, data.width, data.height));
        };

        return (
            <div className="row last">
                <div className="col-lg-12 iframe-bgr" style={bgrStyle}>
                    <div className="iframe-wrapper" ref="page" style={iframeCss}>
                        <iframe src={`/api/scrapper?snapshotUrl=${scrapperUrl}`}></iframe>
                        <Cropper heatmap={this.heatmap} active={this.props.detail.crop.enable} onChange={onCropChange}/>
                    </div>
                    <div className="btn-danger btn-lg fullscreen-button" onClick={this.onFullscreenToggle} style={fullscreenBtnStyle}>
                        <span>X Fullscreen</span>
                    </div>
                </div>
            </div>
        )
    }

    onFullscreenToggle(){
        this.setState({fullscreen: !this.state.fullscreen});
        setTimeout(()=>{
            this.resizeWindow();
        },60);
    };

    render() {
        let heatmapTitle = this.props.detail.heatmapConfig != null ? this.props.detail.heatmapConfig.title : '';

        return (
            <div className="heatmap-detail">
                <div className="row">
                    <div className="col-lg-12">
                        <h3 className="page-header">Detail of heatmap <b>{heatmapTitle}</b></h3>
                    </div>
                </div>
                {this.renderLoadingBar()}
                <div className="row">
                    <div className="col-lg-12">
                        <HeatmapSettings onRefreshButtonClick={this.renderHeatmap} heatmap={this.heatmap}
                                         onFullscreenButtonClick={this.onFullscreenToggle}/>
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