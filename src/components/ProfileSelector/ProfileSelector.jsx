import React from 'react'
import './ProfileSelector.css'
import logo from '../../assets/logo.png'

const ProfileSelector = ({ onProfileSelect }) => {
  const profiles = [
    { id: 1, name: 'Profile 1', color: '#0071eb', number: '1' },
    { id: 2, name: 'Profile 2', color: '#f5c518', number: '2' },
    { id: 3, name: 'Profile 3', color: '#e50914', number: '3' },
    { id: 4, name: 'Profile 4', color: '#008f11', number: '4' },
    { id: 5, name: 'Profile 5', color: '#00d4ff', number: '5' }
  ]

  const handleProfileClick = (profileId) => {
    onProfileSelect(profileId)
  }

  return (
    <div className='profile-selector'>
      <div className='profile-header'>
        <img 
          src={logo} 
          className='profile-logo' 
          alt="Netflix" 
          onClick={() => window.location.reload()}
        />
      </div>
      
      <div className='profile-content'>
        <h1 className='profile-title'>Who's watching?</h1>
        
        <div className='profile-grid'>
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className='profile-item'
              onClick={() => handleProfileClick(profile.id)}
            >
              <div 
                className='profile-avatar'
                style={{ backgroundColor: profile.color }}
              >
                <div className='profile-face'>
                  <div className='profile-eyes'>
                    <div className='profile-eye'></div>
                    <div className='profile-eye'></div>
                  </div>
                  <div className='profile-mouth'></div>
                </div>
              </div>
              {profile.number && (
                <span className='profile-number'>{profile.number}</span>
              )}
            </div>
          ))}
        </div>
        
        <button className='manage-profiles-btn'>
          MANAGE PROFILES
        </button>
      </div>
    </div>
  )
}

export default ProfileSelector
