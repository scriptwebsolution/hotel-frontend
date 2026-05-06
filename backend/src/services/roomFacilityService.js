// Mock Data Store
let facilities = [
  { id: "1", name: "Air conditioner" },
  { id: "2", name: "Lighting" },
  { id: "3", name: "Aroma" },
  { id: "4", name: "Dish line" },
  { id: "5", name: "Free Wifi" },
];

let facilityDetails = [
  { id: "1", facilityType: "Aroma", name: "Aroma", imageUrl: "https://images.unsplash.com/photo-1519824145371-296894a0daa9?auto=format&fit=crop&w=150&q=60" },
  { id: "2", facilityType: "Dish line", name: "Television", imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=150&q=60" },
  { id: "3", facilityType: "Air conditioner", name: "Air conditioner", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=150&q=60" },
  { id: "4", facilityType: "Free Wifi", name: "Free wifi", imageUrl: "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=150&q=60" },
];

let roomSizes = [
  { id: "1", name: "Executive Suite" },
  { id: "2", name: "Double-Double" },
  { id: "3", name: "Twin" },
  { id: "4", name: "King" },
  { id: "5", name: "Queen" },
  { id: "6", name: "Quad" },
  { id: "7", name: "Triple" },
  { id: "8", name: "Double" },
];

// Async wrappers to simulate DB calls
const getFacilityList = async () => [...facilities];
const getFacilityDetails = async () => [...facilityDetails];
const getRoomSizes = async () => [...roomSizes];

const deleteFacility = async (id) => {
  facilities = facilities.filter((f) => f.id !== id);
  return true;
};

const deleteFacilityDetails = async (id) => {
  facilityDetails = facilityDetails.filter((f) => f.id !== id);
  return true;
};

const deleteRoomSize = async (id) => {
  roomSizes = roomSizes.filter((r) => r.id !== id);
  return true;
};

module.exports = {
  getFacilityList,
  getFacilityDetails,
  getRoomSizes,
  deleteFacility,
  deleteFacilityDetails,
  deleteRoomSize,
};
