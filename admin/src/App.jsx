import React from 'react'
import {Toaster} from 'react-hot-toast';
import {Routes , Route} from 'react-router-dom';
import Login from './pages/Login';
import Protectedroute from './components/Protectedroute';
import Dashboard from './pages/admin/Dashboard';
import AllQuotes from './pages/admin/AllQuotes';
import Users from './pages/admin/Users';

const App = () => {
  return (
    <>
    <Toaster position='top-right' />
    <Routes>
      
      {/* Public */}
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route path='/dashboard' element={<Protectedroute> <Dashboard /> </Protectedroute>}/>
        <Route path='/quotes' element={<Protectedroute> <AllQuotes /> </Protectedroute>}/>
        <Route path='/users' element={<Protectedroute> <Users /> </Protectedroute>}/>
      
    </Routes>
    </>
  )
}

export default App
