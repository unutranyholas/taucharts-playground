import React, { Component } from 'react'
import { OptionsMenu } from '../'
import style from './ConfigTree.css'
import _ from 'lodash'

export default class ConfigTree extends Component {
  render() {

    const {config, options, popup, actions} = this.props;
    const props = {
      name: '',
      val: config,
      options: options,
      popup: popup,
      popupName: '',
      actions: actions,
      indent: ''
    };

    return (
      <Obj {...props} />
    )
  }
}

class Obj extends Component {
  render() {

    const {name, val, options, popup, popupName, actions, indent} = this.props;
    const objProps = _.pairs(val).filter(item => item[0] !== 'data').map((item, i) => {

      const key = item[0];
      const value = item[1];
      const type = _.isArray(value) && 'array' || _.isObject(value) && 'object' || _.isString(value) && 'string' || _.isNumber(value) && 'number' || _.isNull(value) && 'null';

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

    const initName = (name === '') ? 'var chart = tauCharts.Chart(' : name + ': ';

    return (
      <span>
        {indent}{initName}{'{\n'}
        {objProps}
        {indent}{'},\n'}
      </span>
    )
  }
}

class Null extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    return (
      <span>{indent}{name}:{' '}null,{'\n'}</span>
    )
  }
}

class Number extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    return (
      <span>{indent}{name}:{'  '}{val},{'\n'}</span>
    )
  }
}

class String extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;

    return (
      <span>{indent}{name}:{' '}'{val}',{'\n'}</span>
    )
  }
}

class Array extends Component {
  render() {
    const {name, val, options, popup, popupName, actions, indent} = this.props;
    let comb;

    switch (name) {
      case 'plugins':
        comb = options.map((opt, i) => {
          return (
            <PluginString key={i} opt={opt} indent={indent}/>
          )
        });
        return (
          <span>
            {indent}{name}:[{'\n'}
            {comb}
            {indent}],{'\n'}
          </span>
        );
      default:
        comb = val.map(v => '\'' + v + '\'').join(', ');
        return (
          <span>
            {indent}{name}: [
            {comb}
            ],{'\n'}
          </span>
        )
    }
  }
}

class PluginString extends Component {
  render() {
    const {opt, indent, actions} = this.props;
    return (
      <span>{indent}{indent}tauCharts.api.plugins.get('<span>{opt}</span>')(),{'\n'}</span>
    )
  }
}
