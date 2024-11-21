
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/main';
import Level1 from './components/level1';
import Level2 from './components/level2';
import Level3 from './components/level3';
import Level4 from './components/level4';
import Level5 from './components/level5';
import OwnLevel from './components/ownLevel';
import Registration from './components/registration';
import Login from './components/login';
import Profile from './components/profile';
import Chat from './components/chat/chat';
import People from './components/people';
function App() {


  return (
    <>
 <BrowserRouter>
      <Routes>
      <Route path="/" element={<Registration/>}/>
      <Route path = "main/prof" element = {<Profile/>}/>
      <Route path="/login" element={<Login/>}/>
        <Route path="/main" element={<Main/>}/>
        <Route path="/level1" element={<Level1/>}/>
        <Route path="/level2" element={<Level2/>}/>
        <Route path="/level3" element={<Level3/>}/>
        <Route path="/level4" element={<Level4/>}/>
        <Route path="/level5" element={<Level5/>}/>
        <Route path = "/levelown" element = {<OwnLevel/>}/>
<Route path="/chat/:userId/:userName" element = {<Chat/>}/>
<Route path = "main/people" element = {<People/>}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
