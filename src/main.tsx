import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.tsx'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import GroupLayerDemo from './map/GroupLayerDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GroupLayerDemo />
  </StrictMode>,
)
