import React, { Component } from 'react'
import { OptionsMenu } from '../'
import style from './Property.css'
import _ from 'lodash'

export default class Property extends Component {
  render() {

    const {name, val, options, action, isMenuShown, toggleMenu} = this.props.p;
    const type = _.isArray(val) && 'array' || _.isObject(val) && 'object' || _.isString(val) && 'string' || _.isNumber(val) && 'number' || _.isNull(val) && 'null';

    switch (type) {
      case 'null':
        return (
          <Null p={this.props.p}/>
        );
      case 'string':
        return (
          <String p={this.props.p}/>
        );
      case 'array':
        return (
          <Array p={this.props.p}/>
        );
      default:
        return (
          <pre>
            <IndentedText text={(name + ':')} />{val}
          </pre>
        )
    }
  }
}

class IndentedText extends Component {
  render() {
    const {text, indent, length}  = this.props;
    //console.log(this.props);
    const indented = '\xa0'.repeat(indent) + text + '\xa0'.repeat(_.max([0, length - text.length]));
    return (
      <span>{indented}</span>
    )
  }
}

class Null extends Component {
  render() {
    const {name, val, options, action, isMenuShown, toggleMenu} = this.props.p;
    return (
      <pre className={(isMenuShown) ? 'show-menu' : null}>
        <IndentedText text={name + ':'} indent="2" length="9" /> <a href="javascript: void 0" onClick={toggleMenu}>null</a>,
        {(isMenuShown) ? <OptionsMenu p={this.props.p}/> : null}
      </pre>
    )
  }
}

class String extends Component {
  render() {
    const {name, val, options, action, isMenuShown, toggleMenu} = this.props.p;

    switch (name) {
      case 'data':
        return (
          <pre>
            <IndentedText text={name + ':'} indent="2" length="9" /> <a href="javascript: void 0">data</a>,
          </pre>
        );
      default:
        return (
          <pre className={(isMenuShown) ? 'show-menu' : null}>
            <IndentedText text={name + ':'} indent="2" length="9" /><a href="javascript: void 0" onClick={toggleMenu}>'{val}'</a>,
            {(isMenuShown) ? <OptionsMenu p={this.props.p}/> : null}
          </pre>
        )
    }
  }
}

class Array extends Component {
  render() {
    const {name, val, options, action, isMenuShown, toggleMenu} = this.props.p;
    let comb;

    switch (name) {
      case 'plugins':
        comb = options.map((opt, i) => {
          const isSelected = (val.indexOf(opt) > -1);
          return (
            <PluginString key={i} opt={opt} isSelected={isSelected} action={action}/>
          )
        });

        return (
          <div>
            <pre><IndentedText text={name + ':'} indent="2" length="9" />[</pre>
            {comb}
            <pre><IndentedText text={''} indent="2" length="0" />],</pre>
          </div>
        );
      default:
        comb = val.map(v => '\'' + v + '\'').join(', ');
        return (
          <pre className={(isMenuShown) ? 'show-menu' : null}>
            <IndentedText text={name + ':'} indent="2" length="8" /><a href="javascript: void 0" onClick={toggleMenu}>[{comb}]</a>,
            {(isMenuShown) ? <OptionsMenu p={this.props.p}/> : null}
          </pre>
        )
    }
  }
}

class PluginString extends Component {
  render() {
    const {opt, isSelected, action} = this.props;

    return (
      <pre className={!isSelected ? 'disabled' : ''}>
        {!isSelected ? <IndentedText text={'//'} indent="2" length="2" /> : <IndentedText text={''} indent="4" length="0" />}tauCharts.api.plugins.get(<a href="javascript: void 0" onClick={action}>'<span
        data-opt={opt}>{opt}</span>'</a>)(),
      </pre>)
  }
}