
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User, Camera } from "lucide-react";
import ItemsList from "@/components/ItemsList";

const Home: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="bg-gradient-to-br from-lost-light to-white p-8 md:p-12 rounded-xl mb-12 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-lost-dark">
            Automated Lost and Found System using Object Recognition
          </h1>
          <p className="text-lg mb-6 text-gray-700">
            Lost something? Our smart object recognition system helps you find lost items
            through our community network. Report items, search with your camera, and get notified
            when your belongings are found.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/search">
              <Button className="bg-lost-primary hover:bg-lost-secondary text-white">
                <Camera className="w-4 h-4 mr-2" />
                Search with Camera
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" className="border-lost-primary text-lost-primary hover:bg-lost-light">
                <User className="w-4 h-4 mr-2" />
                Report a Lost Item
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-lost-dark">Recently Reported Items</h2>
          <Link to="/dashboard" className="text-lost-primary hover:text-lost-secondary">
            View All →
          </Link>
        </div>
        <ItemsList itemType="lost" />
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-lost-light rounded-lg flex items-center justify-center mb-4">
            <Search className="text-lost-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Search with Camera</h3>
          <p className="text-gray-600 mb-4">
            Use our object recognition technology to scan and identify lost items in your vicinity.
          </p>
          <Link to="/search">
            <Button variant="link" className="text-lost-primary p-0">
              Try it now →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-lost-light rounded-lg flex items-center justify-center mb-4">
            <User className="text-lost-primary" />
          </div>
          <h3 className="text-xl font-bold mb-2">Report Lost Items</h3>
          <p className="text-gray-600 mb-4">
            Register your lost items in our database to increase chances of recovery.
          </p>
          <Link to="/dashboard">
            <Button variant="link" className="text-lost-primary p-0">
              Report an item →
            </Button>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="w-12 h-12 bg-lost-light rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-lost-primary">
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Get Notified</h3>
          <p className="text-gray-600 mb-4">
            Receive instant notifications when your items are found by other users.
          </p>
          <Link to="/login">
            <Button variant="link" className="text-lost-primary p-0">
              Create account →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
