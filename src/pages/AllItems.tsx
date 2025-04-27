
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLostFound } from "@/context/LostFoundContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const AllItems: React.FC = () => {
  const { lostItems, getUserById } = useLostFound();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "lost" | "found">("all");

  const filteredItems = lostItems.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Database of All Items</h1>
      
      <div className="max-w-3xl mx-auto mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Search and Filter</CardTitle>
            <CardDescription>Find specific items in our database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="search" className="mb-1 block">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name or description"
                    className="pl-8 form-input"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="status-filter" className="mb-1 block">Status</Label>
                <Select 
                  defaultValue="all" 
                  onValueChange={(value) => setStatusFilter(value as "all" | "lost" | "found")}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="found">Found</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-medium mb-4">
          {filteredItems.length} {filteredItems.length === 1 ? 'Item' : 'Items'} Found
        </h2>
        
        {filteredItems.length > 0 ? (
          <div className="space-y-4">
            {filteredItems.map(item => {
              const owner = getUserById(item.ownerId);
              
              return (
                <Card key={item.id} className="hover:border-lost-primary transition-colors">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:justify-between">
                      <div>
                        <div className="flex items-start gap-2">
                          <h3 className="font-medium">{item.name}</h3>
                          <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                            item.status === "found" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      
                      <div className="mt-2 md:mt-0 md:text-right">
                        <p className="text-sm text-gray-500">Reported by: {owner?.name || "Unknown"}</p>
                        <p className="text-sm text-gray-500">Date: {item.dateReported}</p>
                        {owner && (
                          <p className="text-sm text-gray-500">Contact: {owner.email}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No matching items found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllItems;
