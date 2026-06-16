import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Routes ,Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ProtectedRoute from './components/ProtectedRoute '
import Dashboard from './pages/user/Dashboard'
import AddQuote from './pages/user/AddQuote'
import MyQuotes from './pages/user/MyQuotes'


const App = () => {
  return (
    <>
      <Toaster position='top-right'/>
      <Routes>
        <Route path='/' element={ <Landing />} />
        <Route path='/login' element={ <Login />} />
        <Route path='/register' element={ <Register />} />


        <Route path='/dashboard' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute >} />
        <Route path='/add-quote' element={ <ProtectedRoute> <AddQuote /> </ProtectedRoute >} />
        <Route path='/my-quotes' element={ <ProtectedRoute> <MyQuotes /> </ProtectedRoute >} />
      </Routes>
    </>
  )
}

export default App
