
import React, { useEffect } from "react";
import { useLostFound } from "@/context/LostFoundContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Database, User, Search } from "lucide-react";

const AdminDashboard: React.FC = () => {
  const { currentUser, isAdmin, getAllUsers, getAllItems, getUserById } = useLostFound();
  const navigate = useNavigate();
  
  const users = getAllUsers();
  const items = getAllItems();
  
  // Redirect if not logged in as admin
  useEffect(() => {
    if (!currentUser || !isAdmin()) {
      navigate("/admin/login");
    }
  }, [currentUser, isAdmin, navigate]);

  if (!currentUser || !isAdmin()) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Users</CardDescription>
            <CardTitle className="text-2xl">{users.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">Registered users</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lost Items</CardDescription>
            <CardTitle className="text-2xl">{items.filter(item => item.status === "lost").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Search className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">Items reported as lost</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Found Items</CardDescription>
            <CardTitle className="text-2xl">{items.filter(item => item.status === "found").length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-sm">Items marked as found</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="users" className="w-full mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                All registered users in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Date of Birth</TableHead>
                      <TableHead>Items</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-sm">{user.id}</TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.dob}</TableCell>
                        <TableCell>
                          {items.filter(item => item.ownerId === user.id).length}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="items">
          <Card>
            <CardHeader>
              <CardTitle>Items Database</CardTitle>
              <CardDescription>
                All items reported in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Date Reported</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => {
                      const owner = getUserById(item.ownerId);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                          <TableCell>{owner?.name || "Unknown"}</TableCell>
                          <TableCell>{item.dateReported}</TableCell>
                          <TableCell>
                            <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                              item.status === "found" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {item.status.toUpperCase()}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
