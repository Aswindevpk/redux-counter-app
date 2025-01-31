import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { store } from './app/store.ts'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* providing the store to the app  */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
