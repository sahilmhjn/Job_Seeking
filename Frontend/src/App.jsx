import React, { useEffect, useContext } from 'react'
import './App.css'
import { Context } from './main'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Components/Auth/Login'
import Register from './Components/Auth/Register'
import Navbar from './Components/Layout/Navbar'
import Footer from './Components/Layout/Footer'
import Home from './Components/Home/Home'
import Jobs from './Components/Job/Jobs'
import JobDetails from './Components/Job/JobDetails'
import MyJobs from './Components/Job/MyJob'
import PostJob from './Components/Job/PostJob'
import Application from './Components/Application/Application'
import MyApplication from './Components/Application/MyAppliation'
import NotFound from './Components/NotFound/NotFound'
import axios from 'axios'
import { Toaster } from 'react-hot-toast'

const APP = () => {
  const { isAuthorized, setIsAuthorized, setUser } = useContext(Context)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await (axios).get( "http://localhost:4000/api/v1/user/getuser", { withCredentials: true });
        setUser(response.data.user)
        setIsAuthorized(true)
      } catch (error) {
        setIsAuthorized(false)
      }
    }
    fetchUser();
  }, [isAuthorized])

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/job/getall" element={<Jobs />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/application/:id" element={<Application />} />
          <Route path="/applications/me" element={<MyApplication />} />
          <Route path="/job/post" element={<PostJob />} />
          <Route path="/job/me" element={<MyJobs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Toaster />
      </BrowserRouter>
    </>
  );
};
export default APP
