import React, { useState, useEffect } from "react";
import PageNavigator from "../components/PageNavigator";
import { toast } from "@/hooks/use-toast";

const LocalHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHospitals();
  }, []);

  useEffect(() => {
    filterHospitals();
  }, [hospitals, searchTerm]);

  // ✅ Fetch hospitals from backend API (Dummy Data)
  const loadHospitals = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/hospitals`);
      if (!response.ok) throw new Error("Failed to fetch hospitals");

      const data = await response.json();
      setHospitals(data.hospitals || []); 
    } catch (error) {
      console.error("Error fetching hospitals:", error);
      toast({
        title: "Error",
        description: "Unable to fetch hospitals. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filter hospitals by search term
  const filterHospitals = () => {
    if (!searchTerm.trim()) {
      setFilteredHospitals(hospitals);
      return;
    }
    const filtered = hospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (hospital.address || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
    setFilteredHospitals(filtered);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Local Hospitals
            </h1>
            <p className="text-muted-foreground">
              Find nearby hospitals and healthcare centers
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
              Total Hospitals: {hospitals.length}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search hospitals by name or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Hospital List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading hospitals...</p>
          </div>
        ) : filteredHospitals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-muted-foreground text-2xl">🏥</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm
                ? "No matching hospitals found"
                : "No hospitals available"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms to find what you are looking for."
                : "Hospitals will appear here once fetched from the server."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHospitals.map((hospital, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer transition"
                onClick={() => setSelectedHospital(hospital)}
              >
                <h2 className="text-lg font-semibold text-foreground">
                  {hospital.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {hospital.address}
                </p>
                {hospital.contact && (
                  <p className="text-sm text-muted-foreground">
                    📞 {hospital.contact}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Detail View */}
        {selectedHospital && (
          <div className="fixed bottom-8 right-8 w-80 bg-background p-4 shadow-lg border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-foreground">
                {selectedHospital.name}
              </h3>
              <button
                onClick={() => setSelectedHospital(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✖
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              Address: {selectedHospital.address}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              Contact: {selectedHospital.contact}
            </p>
            <p className="text-sm text-muted-foreground">
              Specialties: {selectedHospital.specialties}
            </p>
          </div>
        )}
      </div>

      {/* Page Navigator */}
      <PageNavigator showLabels={true} position="bottom-center" />
    </div>
  );
};

export default LocalHospitals;
