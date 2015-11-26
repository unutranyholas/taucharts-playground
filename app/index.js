import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, toggleMenu } from './actions'
//import App from './containers/App'
import playgroundApp from './reducers'
import { App } from './components'

let store = createStore(playgroundApp);

store.subscribe(() => {
        //console.log('state', store.getState());
        //console.log('config', store.getState().config);
        //console.log('datasets', store.getState().datasets);
        //console.log('options', store.getState().options);
        //console.log('menu', store.getState().menu);
        //console.log('-----')
    }
);

let rootElement = document.getElementById('root');
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);

store.dispatch(addDataset('catsVsDogs.csv',[{cats: 12, dogs: 42, year: 2013}, {cats: 5, dogs: 15, year: 2014}, {cats: 17, dogs: 11, year: 2015}]));
store.dispatch(addDataset('comets.csv',[{name: 'zzzz', orbit: 12, weight: 18}, {name: 'kkkk', orbit: 29, weight: 331}, {name: 'ssss', orbit: 927, weight: 8472}]));


//store.dispatch(switchDataset('catsVsDogs'));
//store.dispatch(togglePlugin('quick-filter'));
//store.dispatch(updateConfig({x: ['year', 'cats']}));
