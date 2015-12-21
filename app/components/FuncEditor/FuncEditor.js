import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'

import brace from 'brace';
import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';


import style from './FuncEditor.css'

export default class FuncEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {func: props.func.join('\n')}
    this.updateFunction = this.updateFunction.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.state = {func: nextProps.func.join('\n')};
  }

  render (){
    const {name, label, actions, func} = this.props;
    return (
      <AceEditor
        mode="javascript"
        theme="monokai"
        onChange={changes => this.setState({func: changes})}
        onBlur={() => {actions.update(this.state.func)}}
        name={name}
        value={this.state.func}
        defaultValue={func}
        fontSize={11}
        showGutter={false}
        showPrintMargin={false}
        maxLines={8}
        width={'100%'}
        tabSize={2}
        editorProps={{
          $blockScrolling: true,
          //$useSoftTabs: true,
         }}
      />
    )
  }
}




//<Textarea
//  className="editor"
//  placeholder={label}
//  onBlur={actions.update}
//  onChange={e => this.setState({func: e.target.value})}
//  value={this.state.func}
//  defaultValue={func}
///>