import React, { Component } from 'react'
import { OptionsMenu, DataPoint } from '../'
import NumberEditor from '../../vendor/NumberEditor'
import AutosizeInput from 'react-input-autosize'
import style from './ConfigTree.css'
import _ from 'lodash'

export default class ConfigTree extends Component {
  render() {

    const {config, options, popup, dataPoint, actions, collapsing} = this.props;
    const props = {
      name: '',
      val: config,
      options: options,
      popup: popup,
      popupName: 'popup',
      actions: actions,
      indent: '',
      dataPoint: dataPoint,
      collapsing: collapsing
    };

    return (
      <Obj {...props} />
    )
  }
}

class Obj extends Component {
  render() {

    const {name, val, options, popup, popupName, actions, indent, dataPoint, collapsing, valIndent} = this.props;

    if (collapsing.indexOf(popupName) > -1) {
      return (
        <span>
          {indent}<a href="javascript: void 0" onClick={actions.toggleCollapsing} data-collapsing={popupName} className="collapsing">{name}</a>: {'{'}<span className="collapsed"></span>{'}'}{',\n'}
        </span>
      )
    }

    const maxLength = _.max(_.pairs(val).map(p => p[0].length));


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
      const type =
        _.isArray(value) && 'array' ||
        _.isObject(value) && 'object' ||
        _.isString(value) && 'string' ||
        _.isNumber(value) && 'number' ||
        _.isBoolean(value) && 'bool' ||
        _.isUndefined(value) && 'undefined' ||
        _.isNull(value) && 'null';

      const props = {
        key: i,
        name: key,
        val: value,
        options: options[key],
        popup: popup,
        popupName: popupName + '__' + key,
        actions: actions,
        indent: indent + '  ',
        valIndent: _.repeat(' ', Math.max(maxLength - key.length + 1, 1)),
        collapsing: collapsing
      };

        //console.log('PROPS', props);

      switch (type) {
        case 'null':
          return (
            <Null {...props} />
          );
        case 'undefined':
          return (
            <Undef {...props} />
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

    const brackets = (name === '') ? ['var chart = new tauCharts.Chart({', '});'] : [name + ': {', '},'];
    const transformed = (name === '') ? (<span>{'  '}data:{_.repeat(' ', maxLength - 2)}{dataPoint},{'\n'}</span>) : null;
    const collapseLink = (name === '') ? brackets[0] : (<span><a href="javascript: void 0" onClick={actions.toggleCollapsing} data-collapsing={popupName} className="collapsing">{name}</a>: &#123;</span>);

    return (
      <span>
        {indent}{collapseLink}{valIndent}{'\n'}
        {transformed}
        {objProps}
        {indent}{brackets[1]}{'\n'}
      </span>
    )
  }
}

class Null extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent, valIndent} = this.props;

    const isPopupShown = (popupName === popup);
    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    return (
      <span>{indent}{name}:{valIndent}{' '}
        <span className={className}>{optionsMenu}
        <a href="javascript: void 0" data-popup={popupName} onClick={actions.togglePopup}>null</a>
          ,{'\n'}
        </span>
      </span>
    )
  }
}

class Undef extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent, valIndent} = this.props;

    const isPopupShown = (popupName === popup);
    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    return (
      <span>{indent}{name}:{valIndent}{' '}
        <span className={className}>{optionsMenu}
          <a href="javascript: void 0" data-popup={popupName} onClick={actions.togglePopup}>undefined</a>
          ,{'\n'}
        </span>
      </span>
    )
  }
}

class Boolean extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent, valIndent} = this.props;

    const strVal = val.toString();
    const strOptions = options.map(o => o.toString());

    const isPopupShown = (popupName === popup);
    //const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} val={strVal} options={strOptions} />) : null;
    const className = (isPopupShown) ? 'active' : null;


    return (
      <span>{indent}{name}:{valIndent}{' '}
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
    const {name, val, options, popup, popupName, actions, indent, valIndent} = this.props;

    const className = (popupName === popup) ? 'active' : null;

    return (
      <span className="number">{indent}{name}:{valIndent}{' '}
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

  constructor(props) {
    super();
    this.onChange = this.onChange.bind(this);
    this.toggleFocus = this.toggleFocus.bind(this);
    this.moveFocus = this.moveFocus.bind(this);

    this.state = {
      value: props.val,
    };
  }

  render() {
    const {name, val, options, popup, popupName, actions, indent, valIndent} = this.props;

    const isPopupShown = (popupName === popup);
    const className = (isPopupShown) ? 'active' : null;

    if (_.isArray(options)) {

      const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;

      return (
        <span>{indent}{name}:{valIndent}
        <span className={className}>{optionsMenu}
          <a href="javascript: void 0" data-popup={popupName} onClick={actions.togglePopup}>'{val}'</a>
          ,{'\n'}
        </span>
      </span>
      )
    } else {
      return (
        <span className="string">{indent}{name}:{valIndent}
        <span className={className}>
          <a href="javascript: void 0" onClick={this.moveFocus}>'<AutosizeInput value={this.state.value} onFocus={this.toggleFocus} onBlur={this.toggleFocus} onChange={e => { this.onChange(e.target.value) }} />'</a>
          ,{'\n'}
        </span>
      </span>
      )
    }
  }

  componentWillReceiveProps(nextProps){
    this.state = {
      value: nextProps.val,
    };
  }

  onChange(value) {

    this.setState({
      value: value,
    });
    this.props.actions.updateString({[this.props.popupName.replace('popup__','')]: value});
  }

  toggleFocus() {
    this.props.actions.highlightField(this.props.popupName);
  }

  moveFocus(e) {
    e.target.parentNode.querySelector('input').focus();
  }

}

class Array extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent, valIndent} = this.props;

    const isPopupShown = (popupName === popup);
    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;

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
            {indent}{name}:{valIndent}[{'\n'}
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
