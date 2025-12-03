import { useState } from 'react'
import './App.css'
import MapComponent from './map/MapComponent'
// import MessageExampleMessage from './component/MessageExampleMessage'
// import HiearchyTree from './component/HiearchyTree'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <MessageExampleMessage /> */}
      {/* <HiearchyTree /> */}
      <MapComponent />
    </>
  )
}

export default App
