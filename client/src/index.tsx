import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/user.context';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import store from './redux/store';
const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AuthProvider>
          <ThemeProvider theme={theme} defaultMode='system'>
            <BrowserRouter>
              <CssBaseline />
              <App />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </Provider>
    </React.StrictMode>,
  );
}
