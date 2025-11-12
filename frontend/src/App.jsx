import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SocketProvider } from './context/SocketContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Pages
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import BuySell from './pages/BuySell.jsx';
import CreateBuySellPost from './pages/CreateBuySellPost.jsx';
import BuySellDetails from './pages/BuySellDetails.jsx';
import Housing from './pages/Housing.jsx';
import HousingDetails from './pages/HousingDetails.jsx';
import CreateHousingPost from './pages/CreateHousingPost.jsx';
import Events from './pages/Events.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Messages from './pages/Messages.jsx';
import Chat from './pages/Chat.jsx';
import UserProfile from './pages/UserProfile.jsx';
import Calendar from './pages/Calendar.jsx';
import StudyGroups from './pages/StudyGroups.jsx';
import CreateStudyGroup from './pages/CreateStudyGroup.jsx';
import StudyGroupDetails from './pages/StudyGroupDetails.jsx';
import Jobs from './pages/Jobs.jsx';
import CreateJob from './pages/CreateJob.jsx';
import JobDetails from './pages/JobDetails.jsx';
import Food from './pages/Food.jsx';
import CreateFoodOrder from './pages/CreateFoodOrder.jsx';
import FoodDetails from './pages/FoodDetails.jsx';
import LostFound from './pages/LostFound.jsx';
import CreateLostFound from './pages/CreateLostFound.jsx';
import LostFoundDetails from './pages/LostFoundDetails.jsx';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/buysell" element={<BuySell />} />
            <Route path="/buysell/create" element={<ProtectedRoute><CreateBuySellPost /></ProtectedRoute>} />
            <Route path="/buysell/:id" element={<BuySellDetails />} />
            <Route path="/housing" element={<Housing />} />
            <Route path="/housing/:id" element={<HousingDetails />} />
            <Route path="/housing/create" element={<ProtectedRoute><CreateHousingPost /></ProtectedRoute>} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/create" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/chat/:userId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<UserProfile />} />
            <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/study-groups/create" element={<ProtectedRoute><CreateStudyGroup /></ProtectedRoute>} />
            <Route path="/study-groups/:id" element={<StudyGroupDetails />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/create" element={<ProtectedRoute><CreateJob /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/food" element={<Food />} />
            <Route path="/food/create" element={<ProtectedRoute><CreateFoodOrder /></ProtectedRoute>} />
            <Route path="/food/:id" element={<FoodDetails />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/lost-found/create" element={<ProtectedRoute><CreateLostFound /></ProtectedRoute>} />
            <Route path="/lost-found/:id" element={<LostFoundDetails />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;