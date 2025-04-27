
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

// Define types for our data
type User = {
  id: string;
  name: string;
  email: string;
  dob: string;
  role: "user" | "admin"; // Added role field
};

type LostItem = {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  dateReported: string;
  status: "lost" | "found";
  imageUrl?: string;
};

type LostFoundContextType = {
  currentUser: User | null;
  users: User[];
  lostItems: LostItem[];
  login: (email: string, name: string, dob: string) => void;
  adminLogin: (email: string, password: string) => boolean; // Added admin login
  logout: () => void;
  addLostItem: (item: Omit<LostItem, "id" | "dateReported" | "ownerId">) => void;
  updateItemStatus: (itemId: string, status: "lost" | "found") => void;
  getUserItems: (userId: string) => LostItem[];
  getUserById: (userId: string) => User | undefined;
  getAllItems: () => LostItem[];
  getAllUsers: () => User[]; // Added method to get all users
  isAdmin: () => boolean; // Added method to check if current user is admin
};

const LostFoundContext = createContext<LostFoundContextType | undefined>(undefined);

// Generate a unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Initial demo data
const demoUsers: User[] = [
  { id: "user1", name: "John Doe", email: "john@example.com", dob: "1990-01-01", role: "user" },
  { id: "user2", name: "Jane Smith", email: "jane@example.com", dob: "1992-05-15", role: "user" },
  { id: "admin1", name: "Admin User", email: "admin@lostfound.com", dob: "1985-03-20", role: "admin" },
];

const demoItems: LostItem[] = [
  {
    id: "item1",
    name: "Smartphone",
    description: "Black iPhone 13 with a red case",
    ownerId: "user1",
    dateReported: "2023-04-15",
    status: "lost",
  },
  {
    id: "item2",
    name: "Laptop",
    description: "Silver MacBook Pro with stickers",
    ownerId: "user2",
    dateReported: "2023-04-20",
    status: "lost",
  },
  {
    id: "item3",
    name: "Wallet",
    description: "Brown leather wallet with ID cards",
    ownerId: "user1",
    dateReported: "2023-04-25",
    status: "found",
  },
];

export const LostFoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(demoUsers);
  const [lostItems, setLostItems] = useState<LostItem[]>(demoItems);

  // Load data from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const storedUsers = localStorage.getItem("users");
    const storedItems = localStorage.getItem("lostItems");

    if (storedUser) setCurrentUser(JSON.parse(storedUser));
    if (storedUsers) setUsers(JSON.parse(storedUsers));
    if (storedItems) setLostItems(JSON.parse(storedItems));
  }, []);

  // Save data to localStorage on changes
  useEffect(() => {
    if (currentUser) localStorage.setItem("currentUser", JSON.stringify(currentUser));
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("lostItems", JSON.stringify(lostItems));
  }, [currentUser, users, lostItems]);

  const login = (email: string, name: string, dob: string) => {
    // Check if user exists
    let user = users.find((u) => u.email === email);

    // If not, create a new user
    if (!user) {
      user = { id: generateId(), name, email, dob, role: "user" };
      setUsers([...users, user]);
      toast.success("New user registered!");
    }

    setCurrentUser(user);
    toast.success("Logged in successfully!");
  };

  const adminLogin = (email: string, password: string): boolean => {
    // In a real app, you would validate the password with a hashed version
    // Here we use a simple check for the demo
    if (email === "admin@lostfound.com" && password === "admin123") {
      const admin = users.find(u => u.email === email && u.role === "admin");
      if (admin) {
        setCurrentUser(admin);
        toast.success("Admin logged in successfully!");
        return true;
      }
    }
    
    toast.error("Admin login failed. Invalid credentials.");
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast.info("Logged out");
  };

  const addLostItem = (item: Omit<LostItem, "id" | "dateReported" | "ownerId">) => {
    if (!currentUser) {
      toast.error("You need to be logged in to report an item");
      return;
    }

    const newItem: LostItem = {
      ...item,
      id: generateId(),
      ownerId: currentUser.id,
      dateReported: new Date().toISOString().split("T")[0],
    };

    setLostItems([...lostItems, newItem]);
    toast.success("Item reported successfully!");
  };

  const updateItemStatus = (itemId: string, status: "lost" | "found") => {
    setLostItems(
      lostItems.map((item) =>
        item.id === itemId ? { ...item, status } : item
      )
    );
    toast.success(`Item marked as ${status}`);
  };

  const getUserItems = (userId: string) => {
    return lostItems.filter((item) => item.ownerId === userId);
  };

  const getUserById = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  const getAllItems = () => {
    return lostItems;
  };

  const getAllUsers = () => {
    return users.filter(user => user.role === "user");
  };

  const isAdmin = () => {
    return currentUser?.role === "admin";
  };

  const value = {
    currentUser,
    users,
    lostItems,
    login,
    adminLogin,
    logout,
    addLostItem,
    updateItemStatus,
    getUserItems,
    getUserById,
    getAllItems,
    getAllUsers,
    isAdmin,
  };

  return (
    <LostFoundContext.Provider value={value}>
      {children}
    </LostFoundContext.Provider>
  );
};

export const useLostFound = () => {
  const context = useContext(LostFoundContext);
  if (context === undefined) {
    throw new Error("useLostFound must be used within a LostFoundProvider");
  }
  return context;
};
