import "./heatmap-detail.less";
import heatmapRenderer from "./heatmap.min.js";
import React from "react";
import jquery from "jquery";
import { connect } from 'react-redux';
import {TreeStructureDetailed} from  "./../../client/dataColect/TreeStructureDetailed.js";
import {setHeight, setWidth} from './../detail/actions.js';

import HeatmapSettings from './../components/detail/HeatmapSettings.react.js';

class ViewDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            mouseMovements: null,
            mouseClicks: null
        };

        this.loadData();
        this.heatmap = null;

        this.refreshHeatmap = this.refreshHeatmap.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(setWidth(1200));
        this.props.dispatch(setHeight(660));
    }

    loadData() {
        jquery.ajax({
            url: "/api/visit?url=www.aktuality.sk",
            method: "GET",
            dataType: "json"
        }).done((data)=> {
            let mouseMovements = new TreeStructureDetailed();
            let mouseClicks = new TreeStructureDetailed();
            for (let i = 0; i < data.length; i++) {

                try {
                    mouseMovements.mergeData(JSON.parse(data[i].mouse_movements));
                } catch (e) {
                    console.log(e);
                }

                try {
                    mouseClicks.mergeData(JSON.parse(data[i].mouse_clicks));
                } catch (e) {
                    console.log(e);
                }
            }
            
            console.log(mouseMovements);

            this.setState({
                mouseMovements: mouseMovements,
                mouseClicks: mouseClicks
            });
        });
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
                    container: doc.getElementsByTagName('body')[0]
                });
            }
        }

        return this.state.mouseMovements.getDataForHeatmap(doc.getElementsByTagName('html')[0]);
    }

    renderHeatmap(heatmapData) {

        if (typeof this.heatmap == "object") {
            this.heatmap.setData({
                max: heatmapData.max,
                min: heatmapData.min,
                data: heatmapData.points
            })
        }
    }

    refreshHeatmap() {
        let heatmapData = this.processHeatmapData();
        this.renderHeatmap(heatmapData);
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
                        <HeatmapSettings onRefreshButtonClick={this.refreshHeatmap}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 iframe-wrapper" ref="page">
                        <iframe src="/api/scrapper?url=http://aktuality.sk"
                                style={iframeCss}></iframe>
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