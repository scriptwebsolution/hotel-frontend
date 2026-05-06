import { apiGet } from "./apiClient.js";
import { rooms as mockRooms } from "../utils/mockData.js";

const niceImages = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=900&q=60",
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=900&q=60",
];

const mapRoom = (room, index) => ({
  id: room.room_number || room.id,
  name: `Room ${room.room_number || room.id}`,
  type: room.type,
  price: Number(room.price_per_night || 0),
  capacity: Number(room.capacity || 1),
  status: room.is_active ? "Available" : "Maintenance",
  image: room.image_url || niceImages[index % niceImages.length],
  features: room.description
    ? room.description
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [],
});

export async function fetchRooms() {
  const result = await apiGet("/api/rooms");
  const rooms = Array.isArray(result?.data) ? result.data : [];
  
  const backendRooms = rooms.map((r, i) => mapRoom(r, i));
  return [...backendRooms, ...mockRooms];
}
