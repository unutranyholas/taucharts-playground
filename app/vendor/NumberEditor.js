'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactClickdrag = require('react-clickdrag');

var _reactClickdrag2 = _interopRequireDefault(_reactClickdrag);

var _clamp = require('clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _Object = require('react/lib/Object.assign');

var _Object2 = _interopRequireDefault(_Object);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KEYS = {
    UP: 38,
    DOWN: 40,
    ENTER: 13,
    BACKSPACE: 8
};

var ALLOWED_KEYS = [8, // Backspace
9, // Tab
35, // End
36, // Home
37, // Left Arrow
39, // Right Arrow
46, // Delete
48, 49, 50, 51, 52, 53, 54, 55, 56, 57, // 0 - 9
190, // (Dot)
189, 173, // (Minus) - [Multiple values across different browsers]
96, 97, 98, 99, 100, 101, 102, 103, 104, 105, // Numpad 0-9
109 // Numpad - (Minus)
];

var NumberEditor = (function (_React$Component) {
    _inherits(NumberEditor, _React$Component);

    function NumberEditor(props) {
        _classCallCheck(this, NumberEditor);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NumberEditor).call(this, props));

        _this._onKeyDown = _this._onKeyDown.bind(_this);
        _this._onDoubleClick = _this._onDoubleClick.bind(_this);
        _this._onChange = _this._onChange.bind(_this);
        _this._onBlur = _this._onBlur.bind(_this);

        _this.state = {
            startEditing: false,
            wasUsingSpecialKeys: false,
            dragStartValue: Number(_this.props.value)
        };
        return _this;
    }

    _createClass(NumberEditor, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            // start
            if (nextProps.dataDrag.isMouseDown && !nextProps.dataDrag.isMoving) {
                this.setState({
                    dragStartValue: Number(this.props.value)
                });
            }

            if (nextProps.dataDrag.isMoving) {
                var step = this._getStepValue(nextProps.dataDrag, this.props.step);
                this._changeValue(this.state.dragStartValue + nextProps.dataDrag.moveDeltaX * (step / 2));
            }
        }
    }, {
        key: '_changeValue',
        value: function _changeValue(value) {
            var newVal = (0, _clamp2.default)(value.toFixed(this.props.decimals), this.props.min, this.props.max);

            if (this.props.value !== newVal) {
                this.props.onValueChange(newVal);
            }
        }
    }, {
        key: '_getStepValue',
        value: function _getStepValue(e, step) {
            if (e.metaKey || e.ctrlKey) {
                step /= this.props.stepModifier;
            } else if (e.shiftKey) {
                step *= this.props.stepModifier;
            }

            return step;
        }
    }, {
        key: '_onKeyDown',
        value: function _onKeyDown(e) {
            var step = this._getStepValue(e, this.props.step);

            var value = Number(this.props.value);
            var key = e.which;

            if (key === KEYS.UP) {
                e.preventDefault();
                this._changeValue(value + step);
            } else if (key === KEYS.DOWN) {
                e.preventDefault();
                this._changeValue(value - step);
            } else if (key === KEYS.ENTER) {
                e.preventDefault();
                if (this.state.startEditing) {
                    // stop editing + save value
                    this._onBlur(e);
                } else {
                    this.setState({
                        startEditing: true
                    });
                    e.target.select();
                }
            } else if (key === KEYS.BACKSPACE && !this.state.startEditing) {
                e.preventDefault();
            } else if (ALLOWED_KEYS.indexOf(key) === -1) {
                // Suppress any key we are not allowing.
                e.preventDefault();
            }

            if (this.props.onKeyDown) {
                this.props.onKeyDown(e);
            }
        }
    }, {
        key: '_onDoubleClick',
        value: function _onDoubleClick() {
            this.setState({
                startEditing: true
            });
        }
    }, {
        key: '_onChange',
        value: function _onChange(e) {
            this.props.onValueChange(e.target.value);
        }
    }, {
        key: '_onBlur',
        value: function _onBlur(e) {
            this._changeValue(Number(e.target.value));
            this.setState({
                startEditing: false
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var cursor = 'ew-resize';
            var readOnly = true;
            var value = this.props.value;
            if (this.state.startEditing) {
                cursor = 'auto';
                readOnly = false;
            }

            if (!this.state.startEditing) {
                value = Number(value).toFixed(this.props.decimals);
            }

            return _react2.default.createElement('input', {
                type: 'text',
                className: this.props.className,
                readOnly: readOnly,
                value: value,
                style: (0, _Object2.default)(this.props.style, { cursor: cursor }),
                onKeyDown: this._onKeyDown,
                onDoubleClick: this._onDoubleClick,
                onChange: this._onChange,
                onBlur: this._onBlur
            });
        }
    }]);

    return NumberEditor;
})(_react2.default.Component);

NumberEditor.propTypes = {
    className: _react.PropTypes.string,
    decimals: _react.PropTypes.number,
    max: _react.PropTypes.number,
    min: _react.PropTypes.number,
    onValueChange: _react.PropTypes.func,
    step: _react.PropTypes.number,
    stepModifier: _react.PropTypes.number,
    style: _react.PropTypes.object,
    value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number]).isRequired,
    onKeyDown: _react.PropTypes.func
};
NumberEditor.defaultProps = {
    className: '',
    decimals: 0,
    max: Number.MAX_VALUE,
    min: -Number.MAX_VALUE,
    onValueChange: function onValueChange() {},
    step: 1,
    stepModifier: 10,
    style: {}
};

module.exports = (0, _reactClickdrag2.default)(NumberEditor, {
    resetOnSpecialKeys: true,
    touch: true,
    getSpecificEventData: function getSpecificEventData(e) {
        return {
            metaKey: e.metaKey,
            ctrlKey: e.ctrlKey,
            shiftKey: e.shiftKey
        };
    },
    onDragMove: function onDragMove(e) {
        e.preventDefault();
    }
});