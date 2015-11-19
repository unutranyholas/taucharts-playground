export const ADD_DATASET = 'ADD_DATASET';
export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const TOGGLE_PLUGIN = 'TOGGLE_PLUGIN';
export const SWITCH_DATASET = 'SWITCH_DATASET';

export function addDataset(name, data) {
    return {type: ADD_DATASET, name, data}
}

export function updateConfig(changes) {
    return {type: UPDATE_CONFIG, changes}
}

export function togglePlugin(plugin) {
    return {type: TOGGLE_PLUGIN, plugin}
}

export function switchDataset(datasetName) {
    return {type: SWITCH_DATASET, datasetName}
}