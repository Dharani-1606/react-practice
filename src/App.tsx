import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import MessageExampleMessage from './component/MessageExampleMessage'
import Demo from './component/Demo'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MessageExampleMessage />
      <Demo />
    </>
  )
}

export default App
