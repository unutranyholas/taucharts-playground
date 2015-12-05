import React, { Component } from 'react'
import { OptionsMenu } from '../'
import style from './ConfigProp.css'
import _ from 'lodash'

export default class ConfigProp extends Component {
  render() {

    const {name, val, options, isPopupShown, actions} = this.props;
    const type = _.isArray(val) && 'array' || _.isObject(val) && 'object' || _.isString(val) && 'string' || _.isNumber(val) && 'number' || _.isNull(val) && 'null';

    const optionsMenu = (isPopupShown && name !== 'plugins') ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;
    const addSpace = (name !== 'data') ? ' ' : null;

    switch (type) {
      case 'null':
        return (
          <span className={className}>{optionsMenu}  <a href="javascript: void 0" onClick={actions.togglePopup}>null</a></span>
        );
      case 'string':
        return (
          <span className={className}>{optionsMenu}{addSpace}<a href="javascript: void 0" onClick={actions.togglePopup}>'{val}'</a></span>
        );
      case 'array':
        return (
          <span className={className}>{optionsMenu}<Array {...this.props}/></span>
        );
      case 'object':
        return (
          <span className={className}>{optionsMenu} <a href="javascript: void 0" onClick={actions.togglePopup}>{JSON.stringify(val)}</a></span>
        );
      default:
        return (
          <span>
            {name + ':'}{val}
          </span>
        )
    }
  }
}

class Array extends Component {
  render() {
    const {name, val, options, actions} = this.props;
    let comb;

    switch (name) {
      case 'plugins':
        comb = options.map((opt, i) => {
          const isSelected = (val.indexOf(opt) > -1);
          return (
            <PluginString key={i} opt={opt} isSelected={isSelected} actions={actions}/>
          )
        });

        return (
          <span>
            [{'\n'}
            {comb}
            {'  '}],
          </span>
        );
      default:
        comb = val.map(v => '\'' + v + '\'').join(', ');
        return (
          <a href="javascript: void 0" onClick={actions.togglePopup}>[{comb}]</a>
        )
    }
  }
}

class PluginString extends Component {
  render() {
    const {opt, isSelected, actions} = this.props;
    const className = (isSelected) ? null : 'disabled';
    const before = (isSelected) ? '    ' : '  //';

    return (
      <span className={className}>
        {before}tauCharts.api.plugins.get(<a href="javascript: void 0" onClick={actions.update}>'<span
        data-opt={opt}>{opt}</span>'</a>)(),{'\n'}
      </span>
    )
  }
}