import { createRoot } from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider } from '@mui/material';
import theme from './theme';
import './main.scss';
import { App } from './App';
import { store } from './store/store';
import { Provider } from 'react-redux';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StyledEngineProvider>
);
