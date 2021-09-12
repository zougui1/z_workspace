import './wdyr';
import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@material-ui/core';

import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient();
const queryClient2 = new QueryClient();

Object.defineProperty(queryClient, 'id', {
  value: 'queryClient',
});
Object.defineProperty(queryClient2, 'id', {
  value: 'queryClient2',
});
const theme = createTheme({
  palette: {
    type: 'dark'
  }
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient2}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
