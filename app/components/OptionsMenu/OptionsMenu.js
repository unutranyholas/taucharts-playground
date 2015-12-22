import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'
import _ from 'lodash'
import d3 from 'd3'
import style from './OptionsMenu.css'

export default class OptionsMenu extends Component {
  constructor(props) {
    super(props)
    this.state = {top: 0, left: 0, maxHeight: 200}
  }
  render() {
    const {name, val, options, actions, popupName} = this.props;
    let values = _.flatten([val]);

    let list = options.map((opt, i) => {
      const isSelected = (values.indexOf(opt) > -1);

      switch (opt + '-' + name) {
        case 'file-data':
          return (<UploadFile key={i} action={actions.add} />);
        case 'url-data':
          return (<ProvideURL key={i} action={actions.add} />);
        default:
          return (<OptionsItem key={i} name={name} opt={opt} isSelected={isSelected} popupName={popupName} actions={actions} />)
      }
    });

    return (
      <span ref="popupContainer">
        <ul className="menu" style={{left: this.state.left, top: this.state.top, maxHeight: this.state.height}}>
          {list}
        </ul>
      </span>
    )
  }

  componentWillMount () {
    document.addEventListener('click', this.props.actions.togglePopup, false);
  }

  componentWillUnmount () {
    document.removeEventListener('click', this.props.actions.togglePopup, false);
  }

  componentDidMount () {
    const bounds = this.refs.popupContainer.getBoundingClientRect();
    this.setState({
      left: bounds.left,
      top: (bounds.top + bounds.height),
      height: (Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) - (bounds.top + bounds.height + 30)
    });
  }
}


class ProvideURL extends Component {
  render() {
    //TODO: add confirm button and handle pressing 'enter'
    //TODO: loader
    return (
      <li className="sep">
        <Textarea type="text" placeholder="Paste URL" onChange={this.props.action} />
      </li>
    )
  }
}

class UploadFile extends Component {
  render() {
    //TODO: link instead form
    const {action} = this.props;
    return (
      <li className="sep">
        <input type="file" onChange={this.props.action} accept="text/csv,text/json,text/plain" />
      </li>
    )
  }
}

class OptionsItem extends Component {
  render() {
    const {name, opt, isSelected, actions, popupName} = this.props;
    const fixedOpt = opt || 'undefined';
    const actionsList = _.keys(actions);
    const facetButton = ((name === 'x' || name==='y') && !isSelected) ? (<a href="javascript: void 0" onClick={actions.facet} data-opt={opt} data-popup={popupName} className="add"> </a>) : null;
    const mainAction = (actionsList.indexOf('switch') > -1) ? actions.switch : actions.update;
    const className = (isSelected) ? 'selected' : '';

    return (
      <li className={className}>
        <a href="javascript: void 0" onClick={mainAction} data-opt={opt} data-popup={popupName}>{fixedOpt}</a>{facetButton}
      </li>
    )
  }
}