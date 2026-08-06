import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ElevationDemo from './map/elevation/ElevationDemo.tsx'
import ClassBreakDemo from './elevation/ClassBreakDemo.tsx'
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <ClassBreakDemo />
  </StrictMode>,
)
