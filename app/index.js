import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { addDataset, updateConfig, togglePlugin, switchDataset } from './actions'
//import App from './containers/App'
import playgroundApp from './reducers'

let store = createStore(playgroundApp);

store.subscribe(() => {
        console.log(store.getState().config);
        console.log(store.getState().datasets);
    }
);

store.dispatch(addDataset('catsVsDogs',[{cats: 12, dogs: 42, year: 2013}, {cats: 5, dogs: 15, year: 2014}, {cats: 17, dogs: 11, year: 2015}]));
store.dispatch(updateConfig({color: 'dogs'}));
//store.dispatch(updateConfig({y: 'cats'}));
//store.dispatch(updateConfig({x: 'year'}));
//store.dispatch(updateConfig({size: 'dogs'}));
//store.dispatch(togglePlugin('quick-filter'));
//store.dispatch(togglePlugin('legend'));
//store.dispatch(togglePlugin('quick-filter'));

store.dispatch(addDataset('comets',[{name: 'zzzz', orbit: 12, weight: 18}, {name: 'kkkk', orbit: 29, weight: 331}, {name: 'ssss', orbit: 927, weight: 8472}]));
store.dispatch(updateConfig({size: 'name'}));
store.dispatch(switchDataset('catsVsDogs'));
store.dispatch(updateConfig({x: 'year', y: 'cats', size: 'dogs', color: 'cats'}));
store.dispatch(switchDataset('comets'));
store.dispatch(switchDataset('catsVsDogs'));