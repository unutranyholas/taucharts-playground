import { combineReducers } from 'redux'
import update from 'react-addons-update'
import _ from 'lodash'
import { ADD_DATASET, DELETE_DATASET, UPDATE_CONFIG, CREATE_FACET, TOGGLE_PLUGIN, SWITCH_DATASET, TOGGLE_MENU, UPDATE_FUNCTION } from './actions'

const initState = {
  datasets: {},
  config: {
    data: null,
    type: 'scatterplot',
    x: 'cats',
    y: 'dogs',
    size: null,
    color: null,
    plugins: ['tooltip', 'legend']
  },
  functions: {
    parseData: '',
    transformData: ''
  },
  options: {
    data: [],
    type: ['scatterplot', 'line', 'area', 'bar', 'horizontal-bar', 'stacked-bar', 'horizontal-stacked-bar'],
    x: [],
    y: [],
    size: [],
    color: [],
    plugins: ['tooltip', 'legend', 'quick-filter', 'trendline']
  },
  menu: null
};

var toggleArray = (prev, value) => {
  let index = prev.indexOf(value);
  return (index === -1) ? update(prev, {$push: [value]}) : update(prev, {$splice: [[index, 1]]});
};

var saveCurrent = (datasets, config, functions) => {
  if (_.keys(datasets).length === 0) {
    return {}
  }
  var data = config.data;
  datasets[data] = update(datasets[data], {$merge:{defaultConfig: config, defaultFunctions: functions}});

  return datasets
};

function playground(state = initState, action) {
  let keys, options;
  switch (action.type) {
    case 'ADD_DATASET':
      keys = _.keys(action.data[0]);
      const defaultConfig = update(initState.config, {
        $merge: {
          x: keys[0],
          y: keys[1],
          data: action.name,
          type: 'scatterplot'
        }
      });
      const defaultFunctions = update(initState.functions, {$merge: {}});

      const prevDatasets = saveCurrent(state.datasets, state.config, state.functions);
      const newDataset = {[action.name]: {data: action.data, defaultConfig: defaultConfig, defaultFunctions: defaultFunctions, metaData: null}};
      const merged = update(prevDatasets, {$merge: newDataset});

      options = update(state.options, {$merge: {data: _.keys(merged), x: keys, y: keys, size: keys, color: keys}});

      return {
        datasets: merged,
        config: defaultConfig,
        functions: defaultFunctions,
        options: options,
        menu: state.menu
      };

    case 'DELETE_DATASET':
      console.log(action.name);
      //TODO: deleting datasets
      return update(state, {$merge: {}});

    case 'SWITCH_DATASET':
      keys = _.keys(state.datasets[action.name].data[0]);
      options = update(state.options, {$merge: {x: keys, y: keys, size: keys, color: keys}});

      return {
        datasets: saveCurrent(state.datasets, state.config, state.functions),
        config: update({}, {$merge: state.datasets[action.name].defaultConfig}),
        functions: update({}, {$merge: state.datasets[action.name].defaultFunctions}),
        options: options,
        menu: state.menu
      };
    default:
      return {
        datasets: update({}, {$merge: state.datasets}),
        config: config(state.config, action),
        functions: functions(state.functions, action),
        options: update({}, {$merge: state.options}),
        menu: menu(state.menu, action)
      }
  }
}

function config(state = initState.config, action) {
  const [name] = _.keys(action.changes);
  const [value] = _.values(action.changes);

  switch (action.type) {
    case 'UPDATE_CONFIG':
      var changes = update({}, {$merge: action.changes});

      if(_.isArray(state[name])) {
        const updated = toggleArray(state[name], value).slice(-2);
        changes = (updated.length < 2) ? {[name]: updated[0]} : {[name]: updated};
      }

      //if (state.x === action.changes.y) {
      //  changes = update(changes, {$merge: {x: state.y}})
      //}
      //if (state.y === action.changes.x) {
      //  changes = update(changes, {$merge: {y: state.x}})
      //}
      //TODO: fix smart switching

      if (state.color === action.changes.color) {
        changes.color = null;
      }
      if (state.size === action.changes.size) {
        changes.size = null;
      }
      return update(state, {$merge: changes});

    case 'CREATE_FACET':
      const facet = {[name]: _.flatten(update([value], {$push: [state[name]]})).slice(0, 2)};

      return update(state, {$merge: facet});

    case 'TOGGLE_PLUGIN':
      return update(state, {$merge: {plugins: toggleArray(state.plugins, action.plugin)}});

    default:
      return state
  }
}

function functions(state = initState.functions, action) {
  switch (action.type) {
    case 'UPDATE_FUNCTION':
      return update(state, {$merge: action.changes});
    default:
      return state
  }
}

function menu(state = initState.menu, action) {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return (state !== action.prop) ? action.prop : null;
    default:
      return state
  }
}

const playgroundApp = playground;

export default playgroundApp