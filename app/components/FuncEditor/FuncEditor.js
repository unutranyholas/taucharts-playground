import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'

import style from './FuncEditor.css'

export default class FuncEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {func: props.func.join('\n')}
  }

  componentWillReceiveProps(nextProps){
    this.state = {func: nextProps.func.join('\n')};
  }
  render (){
    const {label, actions, func} = this.props;
    return (
      <Textarea
        className="editor"
        placeholder={label}
        onBlur={actions.update}
        onChange={e => this.setState({func: e.target.value})}
        value={this.state.func}
        defaultValue={func}
      />
    )
  }
}