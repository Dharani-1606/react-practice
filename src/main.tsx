import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
// import IndiaLocationMap from './map/IndiaLocationMap'
// import ArcgisClassBreak from './map/ArcgisClassBreak'
// import ClassBReakDemo from './map/ClassBReakDemo'
// import HorizontalTimeline from './component/timeline/HorizontalTimeline'
import Timeline from './component/timeline/Timeline'
// import ElevationDemo from './map/elevation/ElevationDemo'
// import IndiaMap from './map/IndiaMap'
// import SpinnerInputField from './component/SpinnerInputField'
// import GroupLayerDemo from './map/GroupLayerDemo.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <GroupLayerDemo /> */}
    {/* <IndiaLocationMap /> */}
    {/* <ArcgisClassBreak /> */}
    {/* <ClassBReakDemo /> */}
    {/* <ElevationDemo /> */}
    {/* <IndiaMap /> */}
    {/* <div className='spinner-input-section'>
    <SpinnerInputField />
    </div> */}
    {/* <HorizontalTimeline /> */}
    <Timeline />
  </StrictMode>,
)
