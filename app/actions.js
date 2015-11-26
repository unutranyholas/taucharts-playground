export const ADD_DATASET = 'ADD_DATASET';
export const UPDATE_CONFIG = 'UPDATE_CONFIG';
export const TOGGLE_PLUGIN = 'TOGGLE_PLUGIN';
export const SWITCH_DATASET = 'SWITCH_DATASET';
export const CREATE_FACET = 'CREATE_FACET';
export const TOGGLE_MENU = 'TOGGLE_MENU';
export const DELETE_DATASET = 'DELETE_DATASET';

export function addDataset(name, data) {
  return {type: ADD_DATASET, name, data}
}

export function deleteDataset(name) {
  return {type: DELETE_DATASET, name}
}

export function updateConfig(changes) {
  return {type: UPDATE_CONFIG, changes}
}

export function createFacet(changes) {
  return {type: CREATE_FACET, changes}
}

export function togglePlugin(plugin) {
  return {type: TOGGLE_PLUGIN, plugin}
}

export function switchDataset(name) {
  return {type: SWITCH_DATASET, name}
}

export function toggleMenu(prop) {
  return {type: TOGGLE_MENU, prop}
}