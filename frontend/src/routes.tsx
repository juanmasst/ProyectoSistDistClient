import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Profile from './pages/Profile'
import TopicDetail from './pages/TopicDetail'
import Login from './pages/Login'
import Register from './pages/Register'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/topic/:id" element={<TopicDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
} 