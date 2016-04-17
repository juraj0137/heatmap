import "./settings.less";
import "react-input-range/dist/react-input-range.min.css";
import React from "react";
import InputRange from 'react-input-range';
import { connect } from 'react-redux';
import {Input, ButtonGroup, Button} from "react-bootstrap";

import {setHeight, setWidth, setViewTypeClicks, setViewTypeMovements, setRadius, setOpacity, setBlur, VIEW_TYPE_CLICKS, VIEW_TYPE_MOVEMENTS} from './../../detail/actions.js';

class HeatmapSettings extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            renderSettingsVisible: false,
            heatmapRadius: props.heatmapRadius,
            heatmapOpacityMax: props.heatmapOpacityMax,
            heatmapOpacityMin: props.heatmapOpacityMin,
            heatmapBlur: props.heatmapBlur
        };

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

    handleRefreshHeatmap() {
        if (typeof this.props.onRefreshButtonClick == "function")
            this.props.onRefreshButtonClick.call(this);
    }

    renderDimmensions() {
        return (
            <div className="heatmap-dimensions">
                <label className="pull-left">Rozmery:</label>
                <Input className="width" type="number" step="10" addonAfter="px" value={this.props.heatmapWidth}
                       onChange={this.handleWidthChange}/>
                <span className="separator">x</span>
                <Input className="height" type="number" step="10" addonAfter="px" value={this.props.heatmapHeight}
                       onChange={this.handleHeightChange}/>
                <div className="clearfix"></div>
            </div>
        )
    }

    renderHeatmapType() {
        return (
            <div className="heatmap-type">
                <label className="pull-left">Typ heatmapy:</label>
                <ButtonGroup>
                    <Button active={this.props.viewType == VIEW_TYPE_MOVEMENTS} data-type={VIEW_TYPE_MOVEMENTS}
                            onClick={this.handleChangeViewType}>Pohyb</Button>
                    <Button active={this.props.viewType == VIEW_TYPE_CLICKS} data-type={VIEW_TYPE_CLICKS} disabled
                            onClick={this.handleChangeViewType}>Klikanie</Button>
                </ButtonGroup>
            </div>
        )
    }

    renderRenderSettingsButton() {

        let handleShow = (e) => {
            let {renderSettingsVisible} = this.state;
            this.setState({renderSettingsVisible: !renderSettingsVisible});
        };

        return (
            <Button className="render-settings-button" active={this.state.renderSettingsVisible} onClick={handleShow}>
                Možnosti heatmapy
            </Button>
        );
    }

    renderRenderSettings() {
        let wrapperStyle = {
            display: this.state.renderSettingsVisible ? 'block' : 'none'
        };

        let onChangeRadius = (component, value)=> {
                this.setState({heatmapRadius: value});
            },
            onChangeRadiusComplete = ()=> {
                this.props.dispatch(setRadius(this.state.heatmapRadius));
            },
            onChangeOpacity = (component, value)=> {
                this.setState({heatmapOpacityMax: value.max, heatmapOpacityMin: value.min});
            },
            onChangeOpacityComplete = ()=> {
                this.props.dispatch(setOpacity(this.state.heatmapOpacityMin, this.state.heatmapOpacityMax));
            },
            onChangeBlur = (component, value)=> {
                this.setState({heatmapBlur: value});
            },
            onChangeBlurComplete = ()=> {
                this.props.dispatch(setBlur(this.state.heatmapBlur));
            };

        let opacityValue = {
            min: this.state.heatmapOpacityMin,
            max: this.state.heatmapOpacityMax
        }

        return (
            <div className="render-settings-wrapper" style={wrapperStyle}>
                <label>Radius:</label>
                <InputRange minValue={10} maxValue={100} step={1} value={this.state.heatmapRadius}
                            onChange={onChangeRadius} onChangeComplete={onChangeRadiusComplete}/>
                <label>Opacity:</label>
                <InputRange minValue={0} maxValue={1} step={0.01} value={opacityValue}
                            onChange={onChangeOpacity} onChangeComplete={onChangeOpacityComplete}/>
                <label>Blur:</label>
                <InputRange minValue={0} maxValue={1} step={0.01} value={this.state.heatmapBlur}
                            onChange={onChangeBlur} onChangeComplete={onChangeBlurComplete}/>
            </div>
        );
    }

    render() {

        return (
            <div className="heatmap-detail-settings-toolbar">
                <div className="row">
                    {this.renderDimmensions()}
                    {this.renderHeatmapType()}
                    {this.renderRenderSettingsButton()}
                    <Button bsStyle="success" className="show-heatmap pull-right"
                            onClick={this.handleRefreshHeatmap}>Prekresli heatmapu</Button>
                    <div className="clearfix"></div>
                </div>
                <div className="row">
                    {this.renderRenderSettings()}
                    <div className="clearfix"></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return state.heatmapDetail
}

export default connect(mapStateToProps)(HeatmapSettings);