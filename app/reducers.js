import { combineReducers } from 'redux'
import update from 'react-addons-update'
import { _ } from 'underscore'
import { ADD_DATASET, UPDATE_CONFIG, TOGGLE_PLUGIN, SWITCH_DATASET } from './actions'

const initState = {
  datasets: {},
  config: {data: null, type: null, x: null, y: null, size: null, color: null, plugins: []},
  options: {
    data: [],
    type: ['scatterplot', 'line', 'area', 'bar', 'horizontal-bar', 'stacked-bar', 'horizontal-stacked-bar'],
    x: [],
    y: [],
    size: [],
    color: [],
    plugins: ['tooltip', 'legend', 'quick-filter', 'trendline']
  }
};

var toggleArray = (prev, value) => {
    let index = prev.indexOf(value);
    return (index === -1) ? update(prev, {$push: [value]}) : update(prev, {$splice: [[index, 1]]});
};

var saveCurrentConfig = (datasets, config) => {
    if (Object.keys(datasets).length === 0) {
        return {}
    }
    var data = config.data;
    return update(datasets, {[data]: {defaultConfig: {$set: config}}});
};

function playground (state = initState, action){
    let keys, options;
    switch (action.type) {
        case 'ADD_DATASET':
            keys = _.keys(action.data[0]);
            const defaultConfig = update(initState.config, {$merge: {x: keys[0], y: keys[1], data: action.name, type: 'scatterplot'}});

            const prevDatasets = saveCurrentConfig(state.datasets, state.config);
            const newDataset = {[action.name]: {data: action.data, defaultConfig: defaultConfig, metaData: null}};
            const merged = update(prevDatasets, {$merge: newDataset});

            options = update(state.options, {$merge: {data: _.keys(merged), x: keys, y: keys, size: keys, color: keys}});

            return {
                datasets: merged,
                config: defaultConfig,
                options: options
            };
        case 'SWITCH_DATASET':
            keys = _.keys(state.datasets[action.name].data[0]);
            options = update(state.options, {$merge: {x: keys, y: keys, size: keys, color: keys}});

            return {
                datasets: saveCurrentConfig(state.datasets, state.config),
                config: update({}, {$merge: state.datasets[action.name].defaultConfig}),
                options: options
            };
        default:
            return {
                datasets: update({}, {$merge: state.datasets}),
                config: config(state.config, action),
                options: update({}, {$merge: state.options})
            }
    }
}

function config (state = initState.config, action){
    switch (action.type) {
        case 'UPDATE_CONFIG':
            var changes = update({}, {$merge: action.changes});
            if (state.x === action.changes.y) {
              changes = update(changes, {$merge: {x: state.y}})
            }
            if (state.y === action.changes.x) {
              changes = update(changes, {$merge: {y: state.x}})
            }
            if (state.color === action.changes.color) {
              changes.color = null;
            }
            if (state.size === action.changes.size) {
              changes.size = null;
            }
            return update(state, {$merge: changes});

        case 'TOGGLE_PLUGIN':
            return update(state, {$merge: {plugins: toggleArray(state.plugins, action.plugin)}});

        default:
            return state
    }
}

const playgroundApp = playground;

export default playgroundApp