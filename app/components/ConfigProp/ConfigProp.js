import React, { Component } from 'react'
import { OptionsMenu } from '../'
import style from './ConfigProp.css'
import _ from 'lodash'

export default class ConfigProp extends Component {
  render() {

    const {name, val, options, isPopupShown, actions} = this.props;
    const type = _.isArray(val) && 'array' || _.isObject(val) && 'object' || _.isString(val) && 'string' || _.isNumber(val) && 'number' || _.isNull(val) && 'null';

    const optionsMenu = (isPopupShown) ? (<OptionsMenu {...this.props} />) : null;
    const className = (isPopupShown) ? 'active' : null;

    switch (type) {
      case 'null':
        return (
          <span className={className}>{optionsMenu} <a href="javascript: void 0" onClick={actions.togglePopup}>null</a></span>
        );
      case 'string':
        return (
          <span className={className}>{optionsMenu}<a href="javascript: void 0" onClick={actions.togglePopup}>'{val}'</a></span>
        );
      case 'array':
        return (
          <span className={className}>{optionsMenu}<a href="javascript: void 0" onClick={actions.togglePopup}>{JSON.stringify(val)}</a></span>
        );
      case 'object':
        return (
          <span className={className}>{optionsMenu}<a href="javascript: void 0" onClick={actions.togglePopup}>{JSON.stringify(val)}</a></span>
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
//
//class Obj extends Component {
//  render() {
//    const {name, val, options, action, isMenuShown, togglePopup} = this.props;
//    return (
//      <pre className={(isMenuShown) ? 'show-menu' : null}>
//        {name + ':'} <a href="javascript: void 0" onClick={togglePopup}>{JSON.stringify(val)}</a>,
//        {(isMenuShown) ? <OptionsMenu {...this.props} /> : null}
//      </pre>
//    )
//  }
//}
//
//class Null extends Component {
//  render() {
//    const {name, val, options, action, isMenuShown, togglePopup} = this.props;
//    return (
//      <pre className={(isMenuShown) ? 'show-menu' : null}>
//        {name + ':'} <a href="javascript: void 0" onClick={togglePopup}>null</a>,
//        {(isMenuShown) ? <OptionsMenu {...this.props} /> : null}
//      </pre>
//    )
//  }
//}
//
//class String extends Component {
//  render() {
//    const {name, val, options, action, isMenuShown, togglePopup} = this.props;
//
//    switch (name) {
//      //case 'data':
//
//      default:
//        return (
//          <pre className={(isMenuShown) ? 'show-menu' : null}>
//            {name + ':'} <a href="javascript: void 0" onClick={togglePopup}>'{val}'</a>,
//            {(isMenuShown) ? <OptionsMenu {...this.props} /> : null}
//          </pre>
//        )
//    }
//  }
//}
//
//class Array extends Component {
//  render() {
//    const {name, val, options, action, isMenuShown, togglePopup} = this.props;
//    let comb;
//
//    switch (name) {
//      case 'plugins':
//        comb = options.map((opt, i) => {
//          const isSelected = (val.indexOf(opt) > -1);
//          return (
//            <PluginString key={i} opt={opt} isSelected={isSelected} action={action}/>
//          )
//        });
//
//        return (
//          <div>
//            <pre>{name + ':'} [</pre>
//            {comb}
//            <pre>],</pre>
//          </div>
//        );
//      default:
//        comb = val.map(v => '\'' + v + '\'').join(', ');
//        return (
//          <pre className={(isMenuShown) ? 'show-menu' : null}>
//            {name + ':'}<a href="javascript: void 0" onClick={togglePopup}>[{comb}]</a>,
//            {(isMenuShown) ? <OptionsMenu {...this.props}/> : null}
//          </pre>
//        )
//    }
//  }
//}
//
//class PluginString extends Component {
//  render() {
//    const {opt, isSelected, action} = this.props;
//
//    return (
//      <pre className={!isSelected ? 'disabled' : ''}>
//        {!isSelected ? '//' : null}tauCharts.api.plugins.get(<a href="javascript: void 0" onClick={action}>'<span
//        data-opt={opt}>{opt}</span>'</a>)(),
//      </pre>)
//  }
//}