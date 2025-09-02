import React, { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import { Route,Routes, useNavigate } from 'react-router-dom'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import ProfileSelector from './components/ProfileSelector/ProfileSelector'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(()=>{
    onAuthStateChanged(auth, async(user)=>{
      if(user){
        console.log("Logged In");
        setUser(user);
        // Check if user has a previously selected profile
        const savedProfile = localStorage.getItem('selectedProfile');
        if (savedProfile) {
          setSelectedProfile(parseInt(savedProfile));
        }
        // Don't navigate immediately, show profile selector if no profile is selected
      }else{
        console.log("Logged Out");
        setUser(null);
        setSelectedProfile(null);
        localStorage.removeItem('selectedProfile');
        navigate('/login');
      }
    })
  }, [navigate])

  const handleProfileSelect = (profileId) => {
    setSelectedProfile(profileId);
    // Store selected profile in localStorage
    localStorage.setItem('selectedProfile', profileId.toString());
    // Now navigate to home after profile selection
    navigate('/');
  }

  const handleLogout = () => {
    setUser(null);
    setSelectedProfile(null);
    localStorage.removeItem('selectedProfile');
    // navigate will be handled by onAuthStateChanged
  }

  // Show profile selector if user is logged in but no profile is selected
  if (user && !selectedProfile) {
    return (
      <div>
        <ToastContainer theme='dark' />
        <ProfileSelector onProfileSelect={handleProfileSelect} />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer theme='dark' />
      <Routes>
        <Route path='/' element = {<Home onLogout={handleLogout}/>}/>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/player/:id' element = {<Player/>}/>
      </Routes>
    </div>
  )
}

export default App