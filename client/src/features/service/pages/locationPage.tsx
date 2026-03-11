import React, { useEffect, useState } from 'react';
import { BeauticianApi } from '../../../services/api/beautician';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../lib/utils/handleApiError';
import { LocationTagInput, type LocationVO } from '../../shared/locationTagInput'; // adjust path
import type { IAddServiceAreaRequest } from '../../../types/api/beautician';

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceLocationForm() {
  const [serviceLocations, setServiceLocations] = useState<LocationVO[]>([]);
  const [homeServiceLocations, setHomeServiceLocations] = useState<LocationVO[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ── Fetch existing locations ──
  const fetchServiceArea = async () => {
    try {
      const response = await BeauticianApi.getLocation();
      const locations = response.data.data?.locations;

      if (locations?.serviceableLocation?.length) {
        setServiceLocations(
          locations.serviceableLocation.map((loc: any) =>
            typeof loc === "string"
              ? { city: loc, lat: 0, lng: 0, formattedString: loc, shortName: loc }
              : { ...loc, shortName: loc.shortName ?? loc.formattedString.split(",")[0].trim() }
          )
        );
      }

      if (locations?.homeServiceableLocation?.length) {
        setHomeServiceLocations(
          locations.homeServiceableLocation.map((loc: any) =>
            typeof loc === "string"
              ? { city: loc, lat: 0, lng: 0, formattedString: loc, shortName: loc }
              : { ...loc, shortName: loc.shortName ?? loc.formattedString.split(",")[0].trim() }
          )
        );
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  useEffect(() => {
    fetchServiceArea();
  }, []);

  // ── Save locations ──
  const handleSaveLocation = async () => {
    if (serviceLocations.length === 0 && homeServiceLocations.length === 0) {
      toast.warn("Please add at least one location");
      return;
    }

    const payload: IAddServiceAreaRequest = {
      serviceableLocation:
        serviceLocations.length > 0 ? serviceLocations : undefined,
      homeServiceableLocation:
        homeServiceLocations.length > 0 ? homeServiceLocations : undefined,
    };

    try {
      const response = await BeauticianApi.addLocation(payload);
      if (response.data.success) {
        toast.success(response.data.message || "Service area updated");
        await fetchServiceArea();
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  // ── Pamphlet ──
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSavePamphlet = async () => {
    if (!selectedFile) { toast.warn("Please select file first"); return; }
    const formData = new FormData();
    formData.append("pamphletImg", selectedFile);
    try {
      const response = await BeauticianApi.uploadPamphlet(formData);
      if (response.data.success) {
        toast.success(response.data.message || "Pamphlet uploaded");
        setSelectedFile(null);
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">

        {/* ── Location Section ── */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col gap-5">

          <LocationTagInput
            label="Mention serviceable location"
            placeholder="Search city or area e.g. Bangalore"
            value={serviceLocations}
            onChange={setServiceLocations}
          />

          <LocationTagInput
            label="Mention Home serviceable location"
            placeholder="Search city or area e.g. MG Road, Bangalore"
            value={homeServiceLocations}
            onChange={setHomeServiceLocations}
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveLocation}
              className="px-8 py-1.5 bg-cyan-400 text-gray-800 rounded hover:bg-cyan-500 transition-colors font-medium"
            >
              Save Locations
            </button>
          </div>
        </div>

        {/* ── Pamphlet Section ── */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block mb-3 text-gray-800 font-medium">
            Upload service pamphlet{" "}
            <span className="font-bold">[optional]</span>
          </label>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="px-6 py-2 bg-gray-900 text-white rounded cursor-pointer hover:bg-gray-800 transition-colors">
                Upload
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )}
            </div>

            <button
              onClick={handleSavePamphlet}
              className="px-8 py-1.5 bg-cyan-400 text-gray-800 rounded hover:bg-cyan-500 transition-colors font-medium"
            >
              Save Pamphlet
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}