import React from 'react'
import d3 from 'd3'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { addDataset, updateConfig, createFacet, togglePlugin, switchDataset, togglePopup, updateFunction, toggleCollapsing } from './actions'
//import App from './containers/App'
import playgroundApp from './reducers'
import { App } from './components'

let store = createStore(playgroundApp);

store.subscribe(() => {
        //console.log('state', store.getState());
        //console.log('popup', store.getState().popup);
        //console.log('config', store.getState().config);
        //console.log('datasets', store.getState().datasets);
        //console.log('options', store.getState().options);
        //console.log('menu', store.getState().menu);
        //console.log('functions', store.getState().functions);
        //console.log('datasets', store.getState().datasets);
        //console.log('collapsing', store.getState().collapsing);
        //console.log('-----')
    }
);

let rootElement = document.createElement('div');
document.body.appendChild(rootElement);
render(
  <Provider store={store}>
    <App />
  </Provider>,
  rootElement
);
var oscarFilePath = require('file!./examples/oscar.csv');
//store.dispatch(addDataset('catsVsDogs.csv',[{cats: 12, dogs: 42, year: 2013}, {cats: 5, dogs: 15, year: 2014}, {cats: 17, dogs: 11, year: 2015}]));
//store.dispatch(addDataset('comets.csv',[{name: 'zzzz', orbit: 12, weight: 18}, {name: 'kkkk', orbit: 29, weight: 331}, {name: 'ssss', orbit: 927, weight: 8472}]));
d3.csv(oscarFilePath, data => {
  store.dispatch(addDataset('oscar.csv', data));
  store.dispatch(updateFunction({
    parse: [
      "['oscarWins', 'budget', 'boxOffice', 'oscarNom','Runtime','Metascore','imdbRating','imdbVotes','tomatoMeter','tomatoRating','tomatoReviews','tomatoFresh','tomatoRotten','tomatoUserMeter','tomatoUserRating','tomatoUserReviews','tomatoUserReviews'].forEach(function(num){",
      "row[num] = +row[num]",
      "});",
      "row['DVD'] = new Date(row['DVD']);",
      "row['Released'] = new Date(row['Released']);"
    ]
  }))
  store.dispatch(updateConfig({
    x: 'Released',
    y: 'imdbRating',
    color: 'isWinner'
  }));
});


//store.dispatch(switchDataset('catsVsDogs'));
//store.dispatch(togglePlugin('quick-filter'));
//store.dispatch(updateConfig({x: ['year', 'cats']}));


console.log(d3);