import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ActionCableProvider } from 'react-actioncable-provider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/index.css'
import { API_WS_ROOT } from './constants';

ReactDOM.render(

  <React.StrictMode>
    <BrowserRouter>
      <ActionCableProvider url={API_WS_ROOT}>
        <App />
      </ActionCableProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
