import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import ReservationsPage from "./pages/ReservationsPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navbar />
        <main className="max-w-7xl mx-auto p-6">
          <Routes>
            {/* يوجه المستخدم فوراً إلى صفحة الغرف أول ما يفتح الموقع */}
            <Route path="/" element={<Navigate to="/rooms" replace />} />
            
            <Route path="/rooms" element={<RoomPage />} />
            <Route path="/book" element={<HomePage />} />
            <Route path="/reservations" element={<ReservationsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}