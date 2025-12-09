
import { useState, useEffect, useCallback } from 'react';
import { BeauticianList } from '../component/BeauticianList';
import { type IBeauticianDTO, type IBeauticianProfileResponseData } from '../../../types/api/admin';
import { type BeauticianStatusFilterType } from '../../../constants/types/beautician';
import { useNavigate } from 'react-router-dom';
import { SaidBar } from '../../user/component/saidBar/saidbar';
import { BeauticianProfileModal } from '../../models/admin/beauticianProfileModel';
import { adminApi } from '../../../services/api/admin';
import { toast } from 'react-toastify';
import { handleApiError } from '../../../lib/utils/handleApiError';

export const BeauticianListPage = () => {
  const navigate = useNavigate();
  const [beauticians, setBeauticians] = useState<IBeauticianDTO[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<BeauticianStatusFilterType>('pending');
   const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  
  const [selectedBeautician, setSelectedBeautician] = useState<IBeauticianProfileResponseData | null>(null);
  const [selectedVerificationStatus, setSelectedVerificationStatus] = useState<'pending' | 'verified' | 'rejected'>('pending');

  // Fetch beauticians from API
  useEffect(() => {
    const fetchBeauticians = async () => {
      setLoading(true);
      try {
        console.log('🔍 Fetching beauticians:', { 
          page: currentPage, 
          statusFilter,
          filterValue: statusFilter !== 'all' ? statusFilter : undefined 
        });
        
        // Pass pagination and filter parameters to the API
        const params = {
          page: currentPage,
          limit: 10, 
          verificationStatus: statusFilter !== 'all' ? statusFilter : undefined,
        };
        
     
        
        const response = await adminApi.getBeautician(params);
        

        if (response.data?.data) {
         
          const beauticianData = 
            response.data.data.beautician ||  [];
          
    
          
          setBeauticians(Array.isArray(beauticianData) ? beauticianData : []);
          setTotalPages(response.data.data.totalPages || 1);
        } else {
          console.warn('⚠️ No data found in response');
          setBeauticians([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('❌ Error fetching beauticians:', error);
        setBeauticians([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchBeauticians();
  }, [currentPage, statusFilter,refreshTrigger]); 

  const handleStatusFilterChange = (status: BeauticianStatusFilterType) => {
    console.log('🔄 Status filter changed to:', status);
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    console.log('📄 Page changed to:', page);
    setCurrentPage(page);
  };

  const handleApprove = async (userId: string) => {
    try {
        const response = await adminApi.approveBeautician(userId);
      
        if(response.data?.data)
        {
          toast.success(response.data.message)
        }
      setRefreshTrigger(prev => prev + 1);
      
    } catch (error) {
      console.error('Error approving beautician:', error);
      handleApiError(error)
    } finally {
      setSelectedBeautician(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const response = await adminApi.rejectBeautician(userId);
      
        if(response.data?.data)
        {
          toast.success(response.data.message)
        }
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Error rejecting beautician:', error);
      handleApiError(error)
    } finally {
      setSelectedBeautician(null);
    }
  };

  const handleViewProfile = async (userId: string) => {
    try {
      console.log('👤 Fetching profile for userId:', userId);
      
      // Find the verification status from the current list
      const beauticianInList = beauticians.find(b => b.userId=== userId);
      if (beauticianInList) {
        const status = beauticianInList.verificationStatus.toLowerCase() as 'pending' | 'verified' | 'rejected';
        setSelectedVerificationStatus(status);
        console.log('✅ Set verification status:', status);
      }
      
    
      const response = await adminApi.viewProfile(userId);
      
      console.log('📦 Profile response:', response);
      
      if (response.data?.data) {
        setSelectedBeautician(response.data.data);
        console.log('✅ Opened profile modal');
      } else {
        console.error('❌ No profile data in response');
      }
    } catch (error) {
      console.error('❌ Error fetching beautician profile:', error);
      alert('Failed to load beautician profile. Please try again.');
    }
  };

  console.log('🎨 Render state:', { 
    beauticiansCount: beauticians.length, 
    statusFilter, 
    currentPage, 
    loading 
  });

  if (loading && beauticians.length === 0) {
    return (
      <>
        <SaidBar/>
        <div className="flex justify-center items-center min-h-screen ml-60">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading beauticians...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SaidBar/>
      
      <BeauticianList
        beauticians={beauticians}
        currentPage={currentPage}
        totalPages={totalPages}
        activeTab={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        onPageChange={handlePageChange}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewProfile={handleViewProfile}
      />

      {/* Profile Modal */}
      {selectedBeautician && (
        <BeauticianProfileModal
          isOpen={!!selectedBeautician}
          onClose={() => setSelectedBeautician(null)}
          beautician={selectedBeautician}
          verificationStatus={selectedVerificationStatus}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
};