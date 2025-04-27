
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLostFound } from "@/context/LostFoundContext";

const LostItemForm: React.FC = () => {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const { addLostItem } = useLostFound();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      return;
    }
    
    addLostItem({
      name,
      description,
      status: "lost",
    });
    
    // Reset form
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="item-name">Item Name</Label>
        <Input
          id="item-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="What did you lose? (e.g., Smartphone, Wallet, Keys)"
          className="form-input"
        />
      </div>
      
      <div>
        <Label htmlFor="item-description">Description</Label>
        <Textarea
          id="item-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Please provide detailed description including color, brand, distinguishing features, etc."
          className="form-input min-h-[100px]"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-lost-primary hover:bg-lost-secondary text-white"
      >
        Report Lost Item
      </Button>
    </form>
  );
};

export default LostItemForm;
