import React, { useEffect, useState } from 'react';
import { SaidBar } from '../../user/component/saidBar/saidbar';
import { BeauticianApi } from '../../../services/api/beautician';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../lib/utils/handleApiError';

export default function ServiceLocationForm() {
  const [serviceLocation, setServiceLocation] = useState<string>('');
  const [homeServiceLocation, setHomeServiceLocation] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
   const fetchServiceArea=async()=>{
  try{
  const response=await BeauticianApi.getLocation()
    const locations = response.data.data?.locations;
   
   
    if (locations?.serviceableLocation) {
      setServiceLocation(locations.serviceableLocation.join(', '));
    }

    if (locations?.homeServiceableLocation) {
      setHomeServiceLocation(
        locations.homeServiceableLocation.join(', ')
      );
    }
   
  }catch(err)
  {
    handleApiError(err)
  }

 }

  useEffect(()=>{
   fetchServiceArea()
  },[])
  const toArray = (value: string): string[] =>
  value
    .split(',')
    .map(v => v.trim())
    .filter(Boolean);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };



  const handleSaveLocation = async () => {
  if (!serviceLocation && !homeServiceLocation) {
    toast.warn('Please fill in any location fields');
    return;
  }

  const payload = {
    serviceableLocation: serviceLocation
      ? toArray(serviceLocation)
      : undefined,

    homeServiceableLocation: homeServiceLocation
      ? toArray(homeServiceLocation)
      : undefined,
  };

  try {
    const response = await BeauticianApi.addLocation(payload);

    if (response.data.success) {
      toast.success(response.data.message || 'Service area updated');
      await fetchServiceArea()
    }
  } catch (error) {
    handleApiError(error);
  }
};


  const handleSavePamphlet =async () => {
    if (selectedFile) {
    const formData = new FormData();
    formData.append('pamphletImg', selectedFile)
    try {
      const response = await BeauticianApi.uploadPamphlet(formData);
      
      if (response.data.success) {
        toast.success(response.data.message||'pamphlet uploaded')
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Error uploading pamphlet:', error);
      handleApiError(error)
    }
    } else {
      toast.warn('please select file first')
    }
  };



  return (
    <>
  
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        

        {/* Service Location Section */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Mention serviceable location
            </label>
            <input
              type="text"
              value={serviceLocation}
              onChange={(e) => setServiceLocation(e.target.value)}
              placeholder="example:- Bangalore – Jayanagar, MG Road"
              className="w-full px-4 py-2 bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-800 font-medium">
              Mention Home serviceable location
            </label>
            <input
              type="text"
              value={homeServiceLocation}
              onChange={(e) => setHomeServiceLocation(e.target.value)}
              placeholder="example:- Bangalore – Jayanagar, MG Road"
              className="w-full px-4 py-2 bg-white rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-gray-700"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSaveLocation}
              className="px-8 py-1 bg-cyan-400 text-gray-800 rounded hover:bg-cyan-500 transition-colors font-medium"
            >
              Save Locations
            </button>
          </div>
        </div>

        {/* Upload Pamphlet Section */}
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block mb-3 text-gray-800 font-medium">
            upload service pamphlet <span className="font-bold">[optional]</span>
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
              className="px-8 py-1 bg-cyan-400 text-gray-800 rounded hover:bg-cyan-500 transition-colors font-medium"
            >
              Save Pamphlet
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}