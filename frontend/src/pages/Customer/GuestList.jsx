import React, { useEffect, useState } from "react";
import TableToolbar from "../../components/customer/TableToolbar.jsx";
import { getGuests } from "../../services/customerService.js";

// Action Icons
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export default function GuestList() {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getGuests();
      setGuests(data);
    } catch (error) {
      console.error("Failed to load guests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(g => 
    g.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-ink-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-ink-900">Guest List</h1>
      </div>

      <TableToolbar onSearch={setSearchTerm} />

      <div className="overflow-x-auto border border-ink-200 rounded">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-ink-200 text-ink-600">
            <tr>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">SL</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Booking Number</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Guest Name</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Gender</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Mobile</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Email</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Identity Type</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">ID</th>
              <th className="px-4 py-3 font-semibold text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-ink-500">Loading guests...</td>
              </tr>
            ) : filteredGuests.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-ink-500">No guests found.</td>
              </tr>
            ) : (
              filteredGuests.map((guest, idx) => (
                <tr key={guest.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3 border-r border-ink-100">{idx + 1}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.bookingNumber}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.guestName}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.gender}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.mobile}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.email}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.identityType}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{guest.idNumber}</td>
                  <td className="px-4 py-3 flex justify-center gap-1">
                    <button className="bg-cyan-500 text-white p-1.5 rounded hover:bg-cyan-600 transition" title="Edit">
                      <EditIcon />
                    </button>
                    <button className="bg-rose-500 text-white p-1.5 rounded hover:bg-rose-600 transition" title="Delete" onClick={() => window.confirm('Are you sure you want to delete this guest?')}>
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-ink-500">
        <div>Showing 1 to {filteredGuests.length} of {filteredGuests.length} entries</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-ink-200 rounded hover:bg-ink-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 bg-[#28a745] text-white rounded">1</button>
          <button className="px-3 py-1 border border-ink-200 rounded hover:bg-ink-50">Next</button>
        </div>
      </div>
    </div>
  );
}
