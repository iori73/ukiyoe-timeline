import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './App.css'
import './styles/typography.css'
import './styles/variants.css'
import VariantSwitcher from './components/common/VariantSwitcher.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <VariantSwitcher />
    </BrowserRouter>
    <Analytics />
  </StrictMode>,
)






