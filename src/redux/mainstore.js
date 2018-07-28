import { applyMiddleware, createStore } from 'redux';
import { forwardToRenderer } from 'electron-redux';
// import logger from 'redux-logger';
import reducer from './reducer';

// Create the store instance to be used by all main process code.
// Renderer processes need to create their store with different middleware.
// forwardToRenderer must be last middleware component.
const mainStore = createStore(reducer, applyMiddleware(forwardToRenderer));

export default mainStore;
