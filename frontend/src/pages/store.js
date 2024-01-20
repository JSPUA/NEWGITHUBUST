// store.js
import { createStore } from 'redux';
import rootReducer from '../pages/rootReducer.js';


const store = createStore(rootReducer);
export default store;
