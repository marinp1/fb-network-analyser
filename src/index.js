import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

import {createNetwork} from './Network.js';

createNetwork();

registerServiceWorker();
