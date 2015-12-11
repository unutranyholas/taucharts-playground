import React, { Component } from 'react'
import { OptionsMenu, DataPoint } from '../'
import NumberEditor from '../../vendor/NumberEditor'
import style from './ConfigTree.css'
import _ from 'lodash'

export default class ConfigTree extends Component {
  render() {

    const {config, options, popup, actions, dataPoint} = this.props;
    const props = {
      name: '',
      val: config,
      options: options,
      popup: popup,
      popupName: 'popup',
      actions: actions,
      indent: '',
      dataPoint: dataPoint
    };

    return (
      <Obj {...props} />
    )
  }
}

class Obj extends Component {
  render() {

    const {name, val, options, popup, popupName, actions, indent, dataPoint} = this.props;
    const objProps = _.pairs(val)
      .filter(item => item[0] !== 'data')
      .filter(item => {
        if (name !== '') {return true}
        else {
          const exclude = (val.type === 'parallel') ? ['x', 'y', 'size'] : ['columns'];
          return exclude.indexOf(item[0]) === -1
        }
      })
      .map((item, i) => {

      const key = item[0];
      const value = item[1];
      const type = _.isArray(value) && 'array' || _.isObject(value) && 'object' || _.isString(value) && 'string' || _.isNumber(value) && 'number' || _.isBoolean(value) && 'bool' || (_.isNull(value)) && 'null';

      const props = {
        key: i,
        name: key,
        val: value,
        options: options[key],
        popup: popup,
        popupName: popupName + '__' + key,
        actions: actions,
        indent: indent + '  '
      };

      switch (type) {
        case 'null':
          return (
            <Null {...props} />
          );
        case 'string':
          return (
            <String {...props} />
          );
        case 'number':
          return (
            <Number {...props} />
          );
        case 'bool':
          return (
            <Boolean {...props} />
          );
        case 'array':
          return (
            <Array {...props} />
          );
        case 'object':
          return (
            <Obj {...props} />
          );
        default:
          return (
            <String {...props} />
          );
      }
    });

    const brackets = (name === '') ? ['var chart = tauCharts.Chart({', '});'] : [name + ': {', '},'];
    const transformed = (name === '') ? (<span>{'  '}data: {dataPoint},{'\n'}</span>) : null;

    return (
      <span>
        {indent}{brackets[0]}{'\n'}
        {transformed}
        {objProps}
        {indent}{brackets[1]}{'\n'}
      </span>
    )
  }
}

class Null extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    const isPopupShown = (popupName === popup);
    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    return (
      <span>{indent}{name}:{' '}
        <span className={className}>{optionsMenu}
        <a href="javascript: void 0" data-popup={popupName} onClick={actions.togglePopup}>null</a>
          ,{'\n'}
        </span>
      </span>
    )
  }
}

class Boolean extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    const strVal = val.toString();
    const strOptions = options.map(o => o.toString());

    const isPopupShown = (popupName === popup);
    //const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} val={strVal} options={strOptions} />) : null;
    const className = (isPopupShown) ? 'active' : null;


    return (
      <span>{indent}{name}:{' '}
        <span className={className}>
          <a href="javascript: void 0" data-popup={popupName} data-opt={strVal} onClick={actions.toggleBool}>{strVal}</a>
          ,{'\n'}
        </span>
      </span>
    )
  }
}

class Number extends Component {
  constructor(props) {
    super();
    this.onNumberChange = this.onNumberChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.state = {
      numberValue: props.val,
      size: (props.val.toString().length / 2 + 0.4) + 'em'
    };
  }

  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    const className = (popupName === popup) ? 'active' : null;

    return (
      <span className="number">{indent}{name}:{' '}
        <span class={className}>
          <NumberEditor {...options} value={this.state.numberValue} style={{width: this.state.size}} onValueChange={this.onNumberChange} />
          ,{'\n'}
        </span>
      </span>
    )
  }

  onNumberChange(value) {

    this.setState({
      numberValue: value,
      size: (value.toString().length / 2 + 0.4) + 'em'
    });
    this.props.actions.updateNumber({[this.props.popupName.replace('popup__','')]: +value});
    this.props.actions.highlightField(this.props.popupName);
  }

  onKeyDown(e) {
    var key = e.which;
    var value = this.state.numberValue;
    if(key === KEYS.K) {
      this.onNumberChange(value * 1000);
    } else if(key === KEYS.M) {
      this.onNumberChange(value * 1000000);
    }
  }
}


class String extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    const isPopupShown = (popupName === popup);
    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    return (
      <span>{indent}{name}:{' '}
        <span className={className}>{optionsMenu}
          <a href="javascript: void 0" data-popup={popupName} onClick={actions.togglePopup}>'{val}'</a>
          ,{'\n'}
        </span>
      </span>
    )
  }
}

class Array extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    const isPopupShown = (popupName === popup);
    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;


    console.log('options',options);
    console.log('popupName',popupName);
    console.log('popup',popup);
    console.log('optionsmenu',optionsMenu);

    let comb;

    switch (name) {
      case 'plugins':
        comb = options.map((opt, i) => {
          const isSelected = (val.indexOf(opt) > -1);
          return (
            <PluginString key={i} opt={opt} indent={indent} isSelected={isSelected} actions={actions}  />
          )
        });
        return (
          <span>
            {indent}{name}: [{'\n'}
            {comb}
            {indent}],{'\n'}
          </span>
        );
      default:
        comb = val.map(v => '\'' + v + '\'').join(', ');
        return (
          <span>
            {indent}{name}:
            <span className={className}>{optionsMenu}
              <a href="javascript: void 0" data-popup={popupName} onClick={actions.togglePopup}>[{comb}]</a>
              ,{'\n'}
            </span>
          </span>
        )
    }
  }
}

class PluginString extends Component {
  render() {
    const {opt, indent, isSelected, actions} = this.props;
    const before = isSelected ? indent : (indent.substr(0, indent.length - 2) + '//');
    const className = isSelected ? '' : 'disabled';
    return (
      <span className={className}>{indent}{before}tauCharts.api.plugins.get(<a href="javascript: void 0" onClick={actions.togglePlugin} data-opt={opt}>'<span>{opt}</span>'</a>)(),{'\n'}</span>
    )
  }
}
