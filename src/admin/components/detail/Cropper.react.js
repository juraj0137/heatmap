import './cropper.less';
import React, {PropTypes} from "react";

class Cropper extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: props.active == true,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            drag: false
        };

        this.onMouseup = this.onMouseup.bind(this);
        this.onMousemove = this.onMousemove.bind(this);
        this.onMousedown = this.onMousedown.bind(this);
    }


    componentDidMount() {
        this.refs.cropper.addEventListener('mousemove', this.onMousemove);
        this.refs.cropper.addEventListener('mouseup', this.onMouseup);
        this.refs.cropper.addEventListener('mousedown', this.onMousedown);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            show: nextProps.active == true
        })
    }


    onMousemove(e) {
        let srcElm = e.srcElement;
        let elm = srcElm.getBoundingClientRect();

        console.log(this.props.heatmap.getValueAt({
            x: e.clientX - elm.left,
            y: e.clientY - elm.top
        }));
        
        if (this.state.drag == false && e.which == 1) {

            this.setState({
                x: e.clientX - elm.left,
                y: e.clientY - elm.top,
                drag: true
            })
        }
        if (this.state.drag == true && e.which == 1) {
            this.setState({
                width: e.clientX - this.state.x - elm.left,
                height: e.clientY - this.state.y - elm.top
            })
        }
    }

    onMousedown() {
        this.setState({
            x: 0,
            y: 0,
            width: 0,
            height: 0
        });
    }

    onMouseup() {
        this.setState({drag: false});

        let {show, x, y, width, height} = this.state;
        let left, top;
        top = height < 0 ? y + height : y;
        left = width < 0 ? x + width : x;

        this.props.onChange.call(this,{
            y: top,
            x: left,
            height: Math.abs(height),
            width: Math.abs(width)
        });
    }

    render() {

        let {show, x, y, width, height} = this.state;

        let cropperStyle = {
            display: show ? 'block' : 'none'
        };

        let left, top;
        top = height < 0 ? y + height : y;
        left = width < 0 ? x + width : x;

        let selectionStyle = {
            top: top,
            height: Math.abs(height),
            left: left,
            width: Math.abs(width)
        };

        return (
            <div ref="cropper" id="cropper-wrapper" style={cropperStyle}>
                <div id="cropper-selection" style={selectionStyle}></div>
            </div>
        );
    }
}

Cropper.propTypes = {
    active: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired
};

export default Cropper;