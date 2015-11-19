import { combineReducers } from 'redux'
import { ADD_DATASET, UPDATE_CONFIG, TOGGLE_PLUGIN, SWITCH_DATASET } from './actions'

const emptyConfig = {data: null, type: null, x: null, y: null, size: null, color: null, plugins: []};
const staticOptions = {
    type: ['scatterplot', 'line', 'area', 'bar', 'horizontal-bar', 'stacked-bar', 'horizontal-stacked-bar'],
    plugins: ['tooltip', 'legend', 'quick-filter', 'trendline']
};

var toggleArray = (prevState, value) => {
    let copy = [...prevState];

    let index = copy.indexOf(value);
    return (index === -1) ? [...copy, value] : copy.splice(index, 1);
};

var saveCurrentConfig = (datasets, config) => {
    if (Object.keys(datasets).length === 0) {
        return {}
    }
    let copy = {...datasets};
    copy[config.data].defaultConfig = {...config};
    return copy
};

function playground (state = {datasets: {}, config: emptyConfig}, action){

    let saved = saveCurrentConfig(state.datasets, state.config);

    switch (action.type) {
        case 'SWITCH_DATASET':
            return {
                datasets: saved,
                config: {...state.datasets[action.datasetName].defaultConfig}
            };
        case 'ADD_DATASET':
            let [x, y] = Object.keys(action.data[0]);
            let defaultConfig = Object.assign({}, emptyConfig, {x: x, y: y, data: action.name, type: 'scatterplot'});
            let newDataset = {...{}, data: action.data, defaultConfig: defaultConfig, metaData: null};
            return {
                datasets: {...saved, [action.name]: newDataset},
                config: defaultConfig
            };
        default:
            return {
                datasets: {...state.datasets},
                config: config(state.config, action)
            }
    }
}

function config (state = emptyConfig, action){
    switch (action.type) {
        case 'UPDATE_CONFIG':
            let changes = action.changes;
            return Object.assign({}, state, changes);

        case 'TOGGLE_PLUGIN':
            return Object.assign({}, state, toggleArray(state.plugins, action.plugin));

        default:
            return state
    }
}

const playgroundApp = playground;

export default playgroundApp