import React, { useState } from 'react'
import Sidebar from '../Components/Sidebar'
import ChatWindow from '../Components/ChatWindow'
import SideNav from '../Components/SideNav'
import ProfileModal from '../Components/ProfileModal'

function HomePage() {

  const [showProfile, setShowProfile] = useState(false)
  const [openedChats, setOpenedChats] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    image: null
  })

  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      <SideNav
        openProfile={() => setShowProfile(true)}
        profile={profile}
      />

      <Sidebar
        openedChats={openedChats}
        setOpenedChats={setOpenedChats}
        setActiveChat={setActiveChat}
      />

      <div className="flex-1 flex overflow-hidden m-3 rounded-2xl shadow-xl">
        <ChatWindow
          openedChats={openedChats}
          activeChat={activeChat}
          setActiveChat={setActiveChat}
        />
      </div>

      {showProfile && (
        <ProfileModal
          closeModal={() => setShowProfile(false)}
          setProfile={setProfile}
        />
      )}

    </div>
  )
}

export default HomePage 