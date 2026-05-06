import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Booking from "./pages/Booking.jsx";
import Rooms from "./pages/Rooms.jsx";
import Guests from "./pages/Guests.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CustomerList from "./pages/Customer/CustomerList.jsx";
import GuestList from "./pages/Customer/GuestList.jsx";
import FacilityList from "./pages/RoomFacilities/FacilityList.jsx";
import FacilityDetailsList from "./pages/RoomFacilities/FacilityDetailsList.jsx";
import RoomSizeList from "./pages/RoomFacilities/RoomSizeList.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/guests" element={<Guests />} />
        <Route path="/customer/customer-list" element={<CustomerList />} />
        <Route path="/customer/guest-list" element={<GuestList />} />
        <Route path="/room-facilities/facility-list" element={<FacilityList />} />
        <Route path="/room-facilities/facility-details-list" element={<FacilityDetailsList />} />
        <Route path="/room-facilities/room-size-list" element={<RoomSizeList />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
