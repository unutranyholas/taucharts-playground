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
    x: null,
    y: null,
    size: null,
    columns: [],
    color: null,
    plugins: ['tooltip', 'legend'],
    settings: {
      //specEngine: false
    },
    guide: {
      interpolate: 'linear',
      padding: {
        l: 90,
        t: 30,
        r: 30,
        b: 90
      },
      showGridLines: 'xy',
      x: {
        label: {
          text: 'X',
          padding: 40
        },
        textAnchor: 'middle',
        padding: 20,
        rotate: 0,
        autoScale: true,
        tickPeriod: null,
        tickFormat: null
      },
      y: {
        label: {
          text: 'Y',
          padding: 40
        },
        textAnchor: 'end',
        padding: 20,
        rotate: 0,
        autoScale: true,
        tickPeriod: null,
        tickFormat: null
      },
      //color: {
      //  brewer: ['color-red', 'color-green', 'color-blue']
      //}
    }
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
    type: ['scatterplot', 'line', 'area', 'bar', 'horizontal-bar', 'stacked-bar', 'horizontal-stacked-bar', 'parallel'],
    x: [],
    y: [],
    size: [],
    color: [],
    plugins: ['tooltip', 'legend', 'quick-filter', 'trendline'],
    settings: {
      specEngine: ['none']
    },
    guide: {
      interpolate: ['linear', 'linear-closed', 'step', 'step-before', 'step-after', 'basis', 'basis-open', 'basis-closed', 'bundle', 'cardinal', 'cardinal-open', 'cardinal-closed', 'monotone'],
      padding: {
        l: {min: 0, max: 200, step: 10, decimals: 0},
        t: {min: 0, max: 200, step: 10, decimals: 0},
        r: {min: 0, max: 200, step: 10, decimals: 0},
        b: {min: 0, max: 200, step: 10, decimals: 0}
      },
      showGridLines: ['xy', 'x', 'y', 'none'],
      x: {
        label: {
          text: {},
          padding: {min: 0, max: 50, step: 2, decimals: 0}
        },
        textAnchor: ['start', 'middle', 'end'],
        padding: {min: 0, max: 50, step: 2, decimals: 0},
        rotate: {min: 0, max: 360, step: 30, decimals: 0},
        autoScale: [false, true],
        tickPeriod: ['day', 'week', 'month', 'quarter', 'year'],
        tickFormat: ['g', 'f', 'd', 'r', 's']
      },
      y: {
        label: {
          text: {},
          padding: {min: 0, max: 50, step: 2, decimals: 0}
        },
        textAnchor: ['start', 'middle', 'end'],
        padding: {min: 0, max: 50, step: 2, decimals: 0},
        rotate: {min: 0, max: 360, step: 30, decimals: 0},
        autoScale: [false, true],
        tickPeriod: ['day', 'week', 'month', 'quarter', 'year'],
        tickFormat: ['g', 'f', 'd', 'r', 's']
      },
      //color: {
      //  brewer: ['color-red', 'color-green', 'color-blue']
      //}
    }
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

  let prop, newValue, newDims, curConfig, curValue, path,
    changes = [];

  switch (action.type) {
    case 'ADD_DATASET':
      const keys = _.keys(action.data[0]);

      const guide = update(initState.config.guide, {
        x: {label: {text: {$set: keys[0]}}},
        y: {label: {text: {$set: keys[1]}}}
      });

      const config = update(initState.config, {
        $merge: {
          x: keys[0],
          y: keys[1],
          columns: [keys[0], keys[1]],
          data: action.name,
          type: 'scatterplot',
          guide: guide
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
          color: keys,
          columns: keys
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

      const curDims = {
        x: curConfig.x,
        y: curConfig.y,
        size: curConfig.size,
        columns: curConfig.columns
      };


      if (prop === 'x' || prop === 'y' || prop === 'size') {

        if (_.isArray(curValue)) {
          const newProp = (curValue.indexOf(newValue) > -1) ? {[prop]: toggleArray(curValue, newValue)[0]} : {[prop]: newValue};
          newDims = update(curDims, {$merge: newProp});
        } else {
          newDims = update(curDims, {$merge: action.changes});
        }
        newDims.columns = _.chain(newDims).pairs().filter(i => i[0]!=='columns').map(i => i[1]).flatten().compact().uniq().value();

        changes.push({datasets: {[curData]: {config: {$merge: newDims}}}});

        if (prop === 'x') {
          changes.push({datasets: {[curData]: {config: {guide: {x: {label: {text: {$set: newDims.x}}}}}}}});
        }

        if (prop === 'y') {
          changes.push({datasets: {[curData]: {config: {guide: {y: {label: {text: {$set: newDims.y}}}}}}}});
        }

      }
      else if (prop === 'columns') {
        newDims = update(curDims, {columns: {$set: toggleArray(curDims.columns, newValue)}});
        newDims.x = newDims.columns[0];
        newDims.y = newDims.columns[1];
        newDims.size = newDims.columns[2] || null;

        changes.push({datasets: {[curData]: {config: {$merge: newDims}}}});

      } else {
        path = ['datasets', curData, 'config'].concat(prop.split('__'));
        changes.push(_.reduceRight(path, function (memo, arrayValue) {
          var obj = {};
          obj[arrayValue] = memo;
          return obj;
        }, {$set: newValue}));
      }

      if (prop === 'x' && newValue === curConfig.y) {
        const newY = {y: curConfig.x};
        changes.push({datasets: {[curData]: {config: {$merge: newY}}}});
        changes.push({datasets: {[curData]: {config: {guide: {y: {label: {text: {$set: curConfig.x}}}}}}}});
      }

      if (prop === 'y' && newValue === curConfig.x) {
        const newX = {x: curConfig.y};
        changes.push({datasets: {[curData]: {config: {$merge: newX}}}});
        changes.push({datasets: {[curData]: {config: {guide: {x: {label: {text: {$set: curConfig.y}}}}}}}});
      }

      if (prop === 'color' && newValue === curConfig.color) {
        changes = [{datasets: {[curData]: {config: {color: {$set: null}}}}}];
      }

      if (prop === 'size' && newValue === curConfig.size) {
        changes = [{datasets: {[curData]: {config: {size: {$set: null}}}}}];
      }

      return changes.reduce((state, change) => { return update(state, change) }, state);;


    case 'CREATE_FACET':
      prop = _.pairs(action.changes)[0][0];
      newValue = _.pairs(action.changes)[0][1];

      curConfig = datasets[curData].config;
      curValue = curConfig[prop];
      path = ['datasets', curData, 'config'].concat(prop.split('__'));

      newValue = _.flatten(update([newValue], {$push: [curConfig[prop]]})).slice(0, 2);

      changes = _.reduceRight(path, function (memo, arrayValue) {
        var obj = {};
        obj[arrayValue] = memo;
        return obj;
      }, {$set: newValue});


      return update(state, changes);


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