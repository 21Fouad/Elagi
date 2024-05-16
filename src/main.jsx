import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import {  BrowserRouter as Router} from 'react-router-dom'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import { SnackbarProvider } from 'notistack';
import './index.css'




ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        
        <SnackbarProvider maxSnack={3}>
            <App />
        </SnackbarProvider>

    </React.StrictMode>,
)
