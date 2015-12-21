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
  }

  componentWillReceiveProps(nextProps){
    this.state = {func: nextProps.func.join('\n')};
  }

  render (){
    const {name, label, actions, func} = this.props;
    return (
      <div style={{marginLeft: '-0.2em'}}>
        <AceEditor
          mode="javascript"
          theme="monokai"
          className="taukai"
          onChange={changes => this.setState({func: changes})}
          onBlur={() => {actions.update(this.state.func)}}
          name={name}
          value={this.state.func}
          defaultValue={func}
          showGutter={false}
          showPrintMargin={false}
          maxLines={9999}
          width={'100%'}
          tabSize={2}
          wrapEnabled={true}
          highlightActiveLine={false}
          editorProps={{
            //$setUseSoftTabs: true
            //$useSoftTabs: true,
           }}
        />
      </div>
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