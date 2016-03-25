import "./heatmap-detail.less";
import React from "react";
import jquery from "jquery";

import HeatmapSettings from './../components/detail/HeatmapSettings.react.js';

class ViewDetail extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            heatmapWidth: 500,
            heatmapHeight: 500
        };

        this.onSettingsChange = this.onSettingsChange.bind(this);
    }

    componentDidUpdate() {
        console.log(this);
        var x = this.refs['page'].getElementsByTagName('iframe')[0];
        var y = (x.contentWindow || x.contentDocument);
        if (y.document) {
            y = y.document;
        }
    }

    onSettingsChange(state) {
        this.setState({
            heatmapWidth: state.heatmapWidth,
            heatmapHeight: state.heatmapHeight
        })
    }

    render() {

        let iframeCss = {
            width: this.state.heatmapWidth,
            height: this.state.heatmapHeight
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
                        <HeatmapSettings onChange={this.onSettingsChange} {...this.state}/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12" ref="page">
                        <iframe src="http://localhost:8080/api/scrapper?url=http://aktuality.sk"
                                style={iframeCss}></iframe>
                    </div>
                </div>
            </div>
        );
    }

}

export default ViewDetail;