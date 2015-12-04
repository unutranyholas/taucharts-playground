import { combineReducers } from 'redux'
import update from 'react-addons-update'
import _ from 'lodash'
import { ADD_DATASET, DELETE_DATASET, UPDATE_CONFIG, CREATE_FACET, TOGGLE_PLUGIN, SWITCH_DATASET, TOGGLE_POPUP, UPDATE_FUNCTION } from './actions'

const initState = {
  main: {
    datasets: {},
    currentData: null,
    popup: null
  },
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
    parse: [],
    transform: []
  },
  data: {
    init: [],
    parsed: [],
    transformed: []
  },
  options: {
    type: ['scatterplot', 'line', 'area', 'bar', 'horizontal-bar', 'stacked-bar', 'horizontal-stacked-bar, parallel'],
    x: [],
    y: [],
    size: [],
    color: [],
    plugins: ['tooltip', 'legend', 'quick-filter', 'trendline'],
    //guide__interpolate: ['linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone']
  }
};

var toggleArray = (prev, value) => {
  let index = prev.indexOf(value);
  return (index === -1) ? update(prev, {$push: [value]}) : update(prev, {$splice: [[index, 1]]});
};

var prepareData = (data, functions) => {
  //TODO: catch errors

  let initData, parsedData, transformedData;

  let parseData = new Function('row', functions.parse.join('\n') + '\nreturn row');
  let transformData = new Function('data', functions.transform.join('\n') + '\nreturn data');

  console.log(parseData);
  console.log(transformData);

  if (functions.parse.length > 0) {
    initData = _.cloneDeep(data);
    data = _.cloneDeep(data).map(row => {
      row = parseData(row);
      return row
    });
    parsedData = _.cloneDeep(data);
  } else {
    initData = data;
    parsedData = data;
  }

  if (functions.transform.length > 0) {
    data = transformData(data);
    transformedData = _.cloneDeep(data);
  } else {
    transformedData = data;
  }

  return {
    init: initData,
    parsed: parsedData,
    transformed: transformedData
  };
};



function playground(state = initState.main, action) {
  const datasets = state.datasets;
  const curData = state.currentData;

  let prop, newValue, curConfig, curValue;

  switch (action.type) {
    case 'ADD_DATASET':
      const keys = _.keys(action.data[0]);
      const config = update(initState.config, {
        $merge: {
          x: keys[0],
          y: keys[1],
          data: action.name,
          type: 'scatterplot'
        }
      });

      const data = update(initState.data, {
        $merge: {
          init: action.data,
          parsed: action.data,
          transformed: action.data
        }
      });

      const functions = update(initState.functions, {
        $merge: {}
      });

      const options = update(initState.options, {
        $merge: {
          x: keys,
          y: keys,
          size: keys,
          color: keys
        }
      });

      const newDataset = update({}, {
        $merge: {
          config: config,
          data: data,
          functions: functions,
          options: options
        }
      });

      return {
        datasets: update(state.datasets, {$merge: {[action.name]: newDataset}}),
        currentData: action.name,
        popup: state.popup
      };


    case 'DELETE_DATASET':
    case 'UPDATE_CONFIG':
      prop = _.pairs(action.changes)[0][0];
      newValue = _.pairs(action.changes)[0][1];

      curConfig = datasets[curData].config;
      curValue = curConfig[prop];

      var changes = update({}, {$merge: action.changes});

      if(_.isArray(curValue)) {
        const updated = toggleArray(curValue, newValue).slice(-2);
        changes = (updated.length < 2) ? {[prop]: updated[0]} : {[prop]: updated};
      }
      if (curConfig.color === action.changes.color) {
        changes.color = null;
      }
      if (curConfig.size === action.changes.size) {
        changes.size = null;
      }

      //if (config.x === action.changes.y) {
      //  changes = update(changes, {$merge: {x: state.y}})
      //}
      //
      ////if (state.x === action.changes.y) {
      ////  changes = update(changes, {$merge: {x: state.y}})
      ////}
      ////if (state.y === action.changes.x) {
      ////  changes = update(changes, {$merge: {y: state.x}})
      ////}
      ////TODO: fix smart switching

      return update(state, {datasets: {[curData]: {config: {$merge: changes}}}});


    case 'CREATE_FACET':
      prop = _.pairs(action.changes)[0][0];
      newValue = _.pairs(action.changes)[0][1];
      curConfig = datasets[curData].config;
      curValue = curConfig[prop];
      const facet = {[prop]: _.flatten(update([newValue], {$push: [curConfig[prop]]})).slice(0, 2)};

      return update(state, {datasets: {[curData]: {config: {$merge: facet}}}});


    case 'TOGGLE_PLUGIN':
      const curPlugins = datasets[curData].config.plugins;
      const newPlugins = toggleArray(curPlugins, action.plugin);

      return update(state, {datasets: {[curData]: {config: {$merge: {plugins: newPlugins}}}}});


    case 'UPDATE_FUNCTION':
      const newState = update(state, {datasets: {[curData]: {functions: {$merge: action.changes}}}});
      const newData = prepareData(newState.datasets[curData].data.init, newState.datasets[curData].functions);
      const newKeys = _.keys(newData.transformed[0]);
      const newOptions = {x: newKeys, y: newKeys, size: newKeys, color: newKeys};

      return update(newState, {datasets: {[curData]: {data: {$merge: newData}, options: {$merge: newOptions}}}});


    default:
      return {
        datasets: state.datasets,
        currentData: currentData(state.currentData, action),
        popup: popup(state.popup, action)
      }
  }
}

function currentData(state = initState.main.currentData, action) {
  switch (action.type) {
    case 'SWITCH_DATASET':
      return action.name;
    default:
      return state
  }
}

function popup(state = initState.main.popup, action) {
  switch (action.type) {
    case 'TOGGLE_POPUP':
      return (state !== action.prop) ? action.prop : null;
    default:
      return state
  }
}


export default playground









//const initState = {
//  datasets: {},
//  config: {
//    data: null,
//    type: 'scatterplot',
//    x: 'cats',
//    y: 'dogs',
//    size: null,
//    color: null,
//    plugins: ['tooltip', 'legend'],
//    //guide: {interpolate: 'linear'}
//  },
//  functions: {
//    parseData: [],
//    transformData: []
//  },
//  options: {
//    data: [],
//    type: ['scatterplot', 'line', 'area', 'bar', 'horizontal-bar', 'stacked-bar', 'horizontal-stacked-bar'],
//    x: [],
//    y: [],
//    size: [],
//    color: [],
//    plugins: ['tooltip', 'legend', 'quick-filter', 'trendline'],
//    //guide__interpolate: ['linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone']
//  },
//  popup: null
//};
//
//var toggleArray = (prev, value) => {
//  let index = prev.indexOf(value);
//  return (index === -1) ? update(prev, {$push: [value]}) : update(prev, {$splice: [[index, 1]]});
//};
//
//var saveCurrent = (datasets, config, functions) => {
//  if (_.keys(datasets).length === 0) {
//    return {}
//  }
//  var data = config.data;
//  datasets[data] = update(datasets[data], {$merge:{defaultConfig: config, defaultFunctions: functions}});
//
//  return datasets
//};
//
//function playground(state = initState, action) {
//  let keys, options;
//  switch (action.type) {
//    case 'ADD_DATASET':
//      keys = _.keys(action.data[0]);
//      const defaultConfig = update(initState.config, {
//        $merge: {
//          x: keys[0],
//          y: keys[1],
//          data: action.name,
//          type: 'scatterplot'
//        }
//      });
//      const defaultFunctions = update(initState.functions, {$merge: {}});
//
//      const prevDatasets = saveCurrent(state.datasets, state.config, state.functions);
//      const newDataset = {[action.name]: {data: action.data, defaultConfig: defaultConfig, defaultFunctions: defaultFunctions, metaData: null}};
//      const merged = update(prevDatasets, {$merge: newDataset});
//
//      options = update(state.options, {$merge: {data: _.keys(merged), x: keys, y: keys, size: keys, color: keys}});
//
//      return {
//        datasets: merged,
//        config: defaultConfig,
//        functions: defaultFunctions,
//        options: options,
//        popup: state.popup
//      };
//
//    case 'DELETE_DATASET':
//      console.log(action.name);
//      //TODO: deleting datasets
//      return update(state, {$merge: {}});
//
//    case 'SWITCH_DATASET':
//      keys = _.keys(state.datasets[action.name].data[0]);
//      options = update(state.options, {$merge: {x: keys, y: keys, size: keys, color: keys}});
//
//      return {
//        datasets: saveCurrent(state.datasets, state.config, state.functions),
//        config: update({}, {$merge: state.datasets[action.name].defaultConfig}),
//        functions: update({}, {$merge: state.datasets[action.name].defaultFunctions}),
//        options: options,
//        popup: state.popup
//      };
//    default:
//      return {
//        datasets: update({}, {$merge: state.datasets}),
//        config: config(state.config, action),
//        functions: functions(state.functions, action),
//        options: update({}, {$merge: state.options}),
//        popup: popup(state.popup, action)
//      }
//  }
//}
//
//function config(state = initState.config, action) {
//  const [name] = _.keys(action.changes);
//  const [value] = _.values(action.changes);
//
//  switch (action.type) {
//    case 'UPDATE_CONFIG':
//      var changes = update({}, {$merge: action.changes});
//
//      if(_.isArray(state[name])) {
//        const updated = toggleArray(state[name], value).slice(-2);
//        changes = (updated.length < 2) ? {[name]: updated[0]} : {[name]: updated};
//      }
//
//      //if (state.x === action.changes.y) {
//      //  changes = update(changes, {$merge: {x: state.y}})
//      //}
//      //if (state.y === action.changes.x) {
//      //  changes = update(changes, {$merge: {y: state.x}})
//      //}
//      //TODO: fix smart switching
//
//      if (state.color === action.changes.color) {
//        changes.color = null;
//      }
//      if (state.size === action.changes.size) {
//        changes.size = null;
//      }
//      return update(state, {$merge: changes});
//
//    case 'CREATE_FACET':
//      const facet = {[name]: _.flatten(update([value], {$push: [state[name]]})).slice(0, 2)};
//
//      return update(state, {$merge: facet});
//
//    case 'TOGGLE_PLUGIN':
//      return update(state, {$merge: {plugins: toggleArray(state.plugins, action.plugin)}});
//
//    default:
//      return state
//  }
//}
//
//function functions(state = initState.functions, action) {
//  switch (action.type) {
//    case 'UPDATE_FUNCTION':
//      return update(state, {$merge: action.changes});
//    default:
//      return state
//  }
//}
//
//function popup(state = initState.popup, action) {
//  switch (action.type) {
//    case 'TOGGLE_POPUP':
//      return (state !== action.prop) ? action.prop : null;
//    default:
//      return state
//  }
//}

const playgroundApp = playground;

export default playgroundApp