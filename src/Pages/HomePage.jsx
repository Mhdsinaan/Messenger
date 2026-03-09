import React from 'react'
import Sidebar from '../Components/Sidebar'
import ChatWindow from '../Components/ChatWindow'

function HomePage() {
  return (
    <div>
      <div className='bg-yellow-50 h-screen flex'>
       <Sidebar/>
       <ChatWindow/>
      </div>

    </div>
  )
}

export default HomePage