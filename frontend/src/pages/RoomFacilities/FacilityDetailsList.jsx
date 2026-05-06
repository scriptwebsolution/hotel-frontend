import React, { useEffect, useState } from "react";
import TableToolbar from "../../components/customer/TableToolbar.jsx";
import { getFacilityDetailsList, deleteFacilityDetails } from "../../services/roomFacilityService.js";

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
);

const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

export default function FacilityDetailsList() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getFacilityDetailsList();
      setFacilities(data);
    } catch (error) {
      console.error("Failed to load facility details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility details?")) {
      try {
        await deleteFacilityDetails(id);
        fetchData();
      } catch (error) {
        console.error("Failed to delete facility details:", error);
      }
    }
  };

  const filteredFacilities = facilities.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.facilityType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-ink-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-ink-900">Room Facilities Details List</h1>
        <button className="bg-[#007bff] hover:bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium transition flex items-center gap-2">
          <span>+</span> Add Facility Details
        </button>
      </div>

      <TableToolbar onSearch={setSearchTerm} />

      <div className="overflow-x-auto border border-ink-200 rounded mt-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-ink-200 text-ink-600">
            <tr>
              <th className="px-4 py-3 font-semibold border-r border-ink-200 w-16">SL</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Add Facility Type</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200">Facility Name</th>
              <th className="px-4 py-3 font-semibold border-r border-ink-200 w-32">Image</th>
              <th className="px-4 py-3 font-semibold text-center w-24">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-ink-500">Loading facility details...</td>
              </tr>
            ) : filteredFacilities.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-ink-500">No facility details found.</td>
              </tr>
            ) : (
              filteredFacilities.map((facility, idx) => (
                <tr key={facility.id} className="border-b border-ink-100 hover:bg-ink-50">
                  <td className="px-4 py-3 border-r border-ink-100">{idx + 1}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{facility.facilityType}</td>
                  <td className="px-4 py-3 border-r border-ink-100">{facility.name}</td>
                  <td className="px-4 py-3 border-r border-ink-100">
                    <img src={facility.imageUrl} alt={facility.name} className="h-10 w-10 object-cover rounded border border-ink-200" />
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-1">
                    <button className="bg-[#17a2b8] text-white p-1.5 rounded hover:bg-[#138496] transition" title="Edit">
                      <EditIcon />
                    </button>
                    <button 
                      className="bg-[#dc3545] text-white p-1.5 rounded hover:bg-[#c82333] transition" 
                      title="Delete" 
                      onClick={() => handleDelete(facility.id)}
                    >
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
        <div>Showing 1 to {filteredFacilities.length} of {filteredFacilities.length} entries</div>
        <div className="flex gap-1">
          <button className="px-3 py-1 border border-ink-200 rounded hover:bg-ink-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 bg-[#28a745] text-white rounded">1</button>
          <button className="px-3 py-1 border border-ink-200 rounded hover:bg-ink-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
