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
          </Routes>
          <Footer />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;