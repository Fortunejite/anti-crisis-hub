import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import store, { persistor } from './redux/store';
const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
            <ThemeProvider theme={theme('dark')} defaultMode='system'>
              <BrowserRouter>
                <CssBaseline />
                <App />
              </BrowserRouter>
            </ThemeProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
  );
}
