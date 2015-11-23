import React, { Component } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu } from '../../actions'
import { CodeEditor } from '../'
import style from './App.css'


class App extends Component {
  render() {

    const p = this.props;

    return (
      <div className="playground">
        <CodeEditor p={p} />
        <div className="chart">
          123
        </div>
      </div>
    )
  }
}

export default connect(state => state)(App)