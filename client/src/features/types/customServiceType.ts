import type { CategoryServiceTypes, CustomServiceStatusType } from "../../constants/types/service";
import type { CategoryVO, ServiceVO } from "../../types/dtos/service";

export type TabType = 'today' | 'yesterday' | 'earlier';

export interface Submission {
   beauticianId?:string,
  beauticianName:string,
  type:CategoryServiceTypes,
  profileImg:string,
  customServiceId:string,
  category:CategoryVO,
  service:ServiceVO,
  status:CustomServiceStatusType,
  createdAt:string
}

export interface CustomSubmissionsReviewProps {
  submissions: Submission[];
  totalPages: number;
  currentPage: number;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onPageChange: (page: number) => void;
  onReview: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

//custom service review type
export interface ReviewSubmissionData {
  beautician: string;
  submittedDate: string;
  category: string;
  serviceName: string;
  isNewCategory?: boolean;
}

export interface ReviewSubmissionModalProps {
  data: ReviewSubmissionData;
  onReject: () => void;
  onAccept: () => void;
  onClose?: () => void;
}