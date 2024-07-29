import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import FirstPage from './FirstPage'
import MainPage from './MainPage'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<FirstPage />} />
        <Route path='/mainpage' element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
