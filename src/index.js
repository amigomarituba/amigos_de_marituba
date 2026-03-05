import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'

import App from './App';
import store from './store'

import { CustomProvider } from 'rsuite'
import { ptBR } from 'rsuite/esm/locales'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <CustomProvider theme="dark" locale={ptBR}>
      <App />
    </CustomProvider>
  </Provider>,
)
