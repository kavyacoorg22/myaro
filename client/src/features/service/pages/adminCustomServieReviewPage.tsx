
import { useState, useEffect } from 'react';
import type { Submission, TabType } from '../../types/customServiceType';
import CustomSubmissionsReview from '../component/admin/customServiceSubmission';
import { SaidBar } from '../../user/component/saidBar/saidbar';
import { adminApi } from '../../../services/api/admin';
import { handleApiError } from '../../../lib/utils/handleApiError';
import { CustomServiceStatus } from '../../../constants/types/service';
import { toast } from 'react-toastify';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('today');

  useEffect(() => {
    fetchSubmissions(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const fetchSubmissions = async (tab: TabType, page: number) => {
    try{
    const response = await adminApi.getAllCustomService(tab,page);
  
    if(response.data.data)
    {
      setSubmissions(response.data.data.customService||[]);
    setTotalPages(response.data.data?.pagination?.totalPages||0);
    }
  }catch(err)
  {
    handleApiError(err)
  }
 
  };

  const handleReview = async (id: string) => {
  };

  const handleApprove = async (id: string) => {
    try{
     const response=await adminApi.updateCustomServiceStatus(CustomServiceStatus.APPROVED,id)
     if(response)
     {
      toast.success('service approved moved to system')
     await fetchSubmissions(activeTab,currentPage)
     }
    }catch(err)
    {
     handleApiError(err)
    }
  };

  const handleReject = async (id: string) => {
     try{
     const response=await adminApi.updateCustomServiceStatus(CustomServiceStatus.REJECTED,id)
     if(response)
     {
      toast.success('service Rejected')
        await fetchSubmissions(activeTab,currentPage)
     }
    }catch(err)
    {
     handleApiError(err)
    }
  };

  return (
    <>
    <SaidBar/>
    <CustomSubmissionsReview
      submissions={submissions}
      totalPages={totalPages}
      currentPage={currentPage}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onPageChange={setCurrentPage}
      onReview={handleReview}
      onApprove={handleApprove}
      onReject={handleReject}
    />
    </>
  );
}