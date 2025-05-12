import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpDown,
  Home,
  BookOpen,
  Edit,
  Trash2,
  X,
  Users,
  MapPin,
  Building,
  Calendar,
  Filter,
  Pencil,
  PlusCircle,
  Search,
  Trash,
  Menu,
  Check,
  AlertCircle,
  Bell,
  Settings,
  ClipboardList,
  User,
  FileText,
} from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { RoomForm } from "../components/RoomForm";

// Mock data - replace with actual data fetching

function RoomsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [editingRoom, setEditingRoom] = useState(undefined);
  const [activeRow, setActiveRow] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inUse: 0,
  });

  const filteredRooms = (rooms || []).filter((room) =>
    (room?.roomName ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update stats when room change
  useEffect(() => {
    const newStats = {
      total: rooms.length,
      available: rooms.filter((room) => room.RoomStatus === "Available").length,
      inUse: rooms.filter((room) => room.RoomStatus === "In Use").length,
    };
    setStats(newStats);
  }, [rooms]);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/admin/' },
    { icon: BookOpen, label: 'Exams', path: '/dashboard/admin/exams' },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/admin/schedule' },
    { icon: Users, label: 'Supervisors', path: '/dashboard/admin/supervisors' },
    { icon: Users, label: 'Students', path: '/dashboard/admin/students' },
    { icon: MapPin, label: 'Rooms', path: '/dashboard/admin/rooms', active: true },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: ClipboardList, label: 'Validations', path: '/validations' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token

        if (!token) {
          console.error("No token found in localStorage");
          return; // Stop execution if token is missing
        }

        const response = await axios.get("http://localhost:8000/api/rooms", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass token in headers
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          // ✅ Add `duration` (in minutes) & `status: "DRAFT"` to each exam
          const roomsWithExtraFields = response.data.map((room) => ({
            ...room,
            id: room.roomId,
            RoomStatus: room.isAvailable ? "Available" : "In Use",
            Name: room.roomName,
            capacity: room.capacity, // Default status
            location: room.location,
          }));

          setRooms(roomsWithExtraFields);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch exams:",
          error.response ? error.response.data : error
        );
      }
    };
    fetchRooms();
  }, []);

  const removeRoom = async (roomId) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Retrieve token
  
      if (!token) {
        console.error("No token found in localStorage");
        return; // Stop execution if token is missing
      }
  
      const response = await axios.delete(
        `http://localhost:8000/api/rooms/${roomId}`, // ✅ Backticks for template string
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Template string here too
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
  
      // ✅ Only update state after successful deletion
      setRooms((prev) => prev.filter((room) => room.id !== roomId));
      showNotification("Room deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting room:", error.response ? error.response.data : error);
      const message =
        error.response?.data?.message ||
        "Failed to delete room. It may be currently in use.";
      showNotification(message, "warning");
    }
  };
  
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddRoom = (roomData) => {
    const newRoom = {
      ...roomData,
      id: crypto.randomUUID(),
    };
    setRooms((prev) => [...prev, newRoom]);
    setIsFormOpen(false);
    showNotification("Room added successfully!");
  };

  const handleEditRoom = (roomData) => {
    if (!editingRoom) return;
    setRooms((prev) =>
      prev.map((room) =>
        room.id === editingRoom.id ? { ...roomData, id: room.id } : room
      )
    );
    setEditingRoom(undefined);
    setIsFormOpen(false);
    showNotification("Room updated successfully!");
  };

  const handleDeleteRoom = (roomId) => {
    setRoomToDelete(roomId);
    setShowPopup(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
{/* Sidebar */}
<aside
  className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}
  aria-hidden={!isSidebarOpen}
>
  {/* Header */}
  <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
    <div className="flex items-center">
      <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
        <ClipboardList className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Exam Admin</h2>
    </div>
    <button
      onClick={() => setSidebarOpen(false)}
      className="p-2 rounded-md lg:hidden hover:bg-gray-100 transition-colors"
      aria-label="Close sidebar"
    >
      <X className="w-5 h-5 text-gray-600" />
    </button>
  </div>

  {/* Navigation */}
  <nav className="mt-6 px-4" aria-label="Main Navigation">
    <ul className="space-y-1">
      {sidebarItems.map((item, index) => (
        <li key={index}>
          <button
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-current={item.active ? "page" : undefined}
          >
            <item.icon className={`w-5 h-5 mr-3 ${item.active ? "text-blue-600" : "text-gray-500"}`} />
            <span className={item.active ? "font-medium" : ""}>{item.label}</span>
            {item.active && (
              <div className="ml-auto bg-blue-600 w-1.5 h-5 rounded-full" />
            )}
          </button>
        </li>
      ))}
    </ul>
  </nav>

  {/* Footer */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
    <div className="flex items-center space-x-3 px-2">
    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
    <User className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
        <p className="text-xs text-gray-500 truncate">admin@example.com</p>
      </div>
      <button 
        className="p-1.5 rounded-full hover:bg-gray-100"
        aria-label="User settings"
      >
        <Settings className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  </div>
</aside>

      {/* Notification toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : notification.type === "warning"
              ? "bg-amber-100 text-amber-800 border-l-4 border-amber-500"
              : "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
          }`}
        >
          {notification.type === "success" ? (
            <Check className="h-5 w-5 mr-2" />
          ) : notification.type === "warning" ? (
            <AlertCircle className="h-5 w-5 mr-2" />
          ) : (
            <BookOpen className="h-5 w-5 mr-2" />
          )}
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md lg:hidden hover:bg-gray-200 transition"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <div className="h-12 w-12 rounded-lg bg-cyan-100 flex items-center justify-center mr-4 shadow-md">
                  <Building className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-800">
                    Room Management
                  </h1>
                  <p className="text-gray-500">
                    Manage exam rooms and facilities
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => showNotification(!showNotification)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-cyan-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Building className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Rooms
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Available
                  </p>
                  <p className="text-2xl font-bold">{stats.available}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-amber-500 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    In Use
                  </p>
                  <p className="text-2xl font-bold">{stats.inUse}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rooms Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-2 mb-6">
              <Building className="h-5 w-5 text-cyan-600" />
              <h2 className="text-xl font-bold text-gray-800">Rooms</h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-gray-100 transition"
                >
                  <Building className="h-4 w-4" />
                  All Rooms
                  <Badge variant="secondary" className="ml-1">
                    {stats.total}
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-gray-100 transition"
                >
                  <Calendar className="h-4 w-4" />
                  Available
                  <Badge variant="secondary" className="ml-1">
                    {stats.available}
                  </Badge>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 hover:bg-gray-100 transition"
                >
                  <Calendar className="h-4 w-4" />
                  In Use
                  <Badge variant="secondary" className="ml-1">
                    {stats.inUse}
                  </Badge>
                </Button>
              </div>

              <Button
                className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-md hover:shadow-lg transition"
                onClick={() => {
                  setIsFormOpen(true);
                  setEditingRoom(undefined);
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4 text-white" />
                Add Room
              </Button>
            </div>

            {/* Form section */}
            {isFormOpen && (
              <div className="mb-8">
                <RoomForm
                  room={editingRoom}
                  onSubmit={editingRoom ? handleEditRoom : handleAddRoom}
                  onCancel={() => {
                    setIsFormOpen(false);
                    setEditingRoom(undefined);
                  }}
                />
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rooms..."
                  className="pl-8 w-full border-gray-300 focus:ring-cyan-500 focus:border-cyan-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="flex items-center gap-1 hover:bg-gray-100 transition"
              >
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
            </div>

            <div className="rounded-md border shadow-sm hover:shadow-md transition-shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="max-w-1/5">
                      <div className="flex items-center gap-1">
                        ROOM NAME
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        BUILDING
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        CAPACITY
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        STATUS
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No rooms found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRooms.map((room) => (
                      <TableRow
                        key={room.id}
                        className={`hover:bg-indigo-50/30 transition-all ${
                          activeRow === room.id ? "bg-indigo-50" : ""
                        }`}
                        onMouseEnter={() => setActiveRow(room.id)}
                        onMouseLeave={() => setActiveRow(null)}
                      >
                        <TableCell className="font-medium">
                          {room.roomName}
                        </TableCell>
                        <TableCell>{room.location}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              room.RoomStatus === "Available"
                                ? "bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                                : "bg-red-100 text-red-800 hover:bg-red-100 border-red-200"
                            }
                          >
                            {room.RoomStatus}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`flex ${
                              activeRow === room.id ? "opacity-100" : "opacity-30"
                            } transition-opacity `}
                          >
                            <button
                              onClick={() => {
                                setEditingRoom(room);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-100 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="p-1.5 text-red-600 hover:text-red-900 hover:bg-red-100 rounded-md transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="text-sm text-gray-500 mt-4">
              Showing {filteredRooms.length} of {rooms.length} rooms
            </div>
          </div>
        </main>
      </div>

      {showPopup && (
        <div className="backdrop fixed inset-0 flex items-center justify-center">
        <div className="group select-none w-[300px] flex flex-col p-6 bg-gray-800 border border-gray-800 shadow-lg rounded-2xl text-center relative z-50">
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              className="group-hover:animate-bounce w-12 h-12 text-red-500 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                fillRule="evenodd"
              ></path>
            </svg>
            <h2 className="text-xl font-bold py-4 text-gray-200">
              Are you sure?
            </h2>
            <p className="text-sm text-gray-500 px-2">
              Do you really want to delete this room? This action cannot be
              undone.
            </p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="px-5 py-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-full hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  removeRoom(roomToDelete);
                  setShowPopup(false);
                  setRoomToDelete(null);
                }}
                className="px-5 py-2 bg-red-500 text-white border border-red-500 rounded-full hover:bg-transparent hover:text-red-500 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomsPage;