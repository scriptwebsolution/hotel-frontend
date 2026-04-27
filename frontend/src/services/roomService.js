import { apiGet } from "./apiClient.js";

const mapRoom = (room) => ({
  id: room.room_number || room.id,
  name: `Room ${room.room_number || room.id}`,
  type: room.type,
  price: Number(room.price_per_night || 0),
  capacity: Number(room.capacity || 1),
  status: room.is_active ? "Available" : "Maintenance",
  image: "",
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
  return rooms.map(mapRoom);
}
