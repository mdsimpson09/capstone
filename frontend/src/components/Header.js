import React from 'react'
import Account from '@mui/icons-material/AccountCircle';
import ChatIcon from '@mui/icons-material/QuestionAnswer';
import GamePadIcon from '@mui/icons-material/SportsEsports';
import './Header.css';
import { IconButton } from '@mui/material';



function Header() {
  return (
    <div className ='gamer-header' >
      <IconButton className='header-icons' fontSize= 'medium'>  
      <Account fontSize= 'medium'/>
      </IconButton>

      <GamePadIcon className='header-middle' fontSize='large'/>

      <IconButton className='header-icons' fontSize= 'medium'>
      <ChatIcon fontSize ='medium'/>
      </IconButton>
    </div>
  )
}

export default Header;

