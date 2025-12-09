import  { useEffect, useMemo, useState } from "react";
import UsersList from "../pages/userList";
import { adminApi } from "../../../services/api/admin";
import { type IUserDto } from "../../../types/dtos/user"; 
import { handleApiError } from "../../../lib/utils/handleApiError";
import {AlertDialog,AlertDialogAction, AlertDialogCancel,AlertDialogContent,AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,} from "../../../components/ui/alert-dialog";
      
import { AlertTriangle, CheckCircle } from "lucide-react";

const DEFAULT_PAGE_SIZE = 10;

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "beautician" | "customer">("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [users, setUsers] = useState<IUserDto[]>([]);
  

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    userId: string;
    currentStatus: boolean;
  }>({ open: false, userId: '', currentStatus: false });

  useEffect(() => {
    getUsers();
  }, [roleFilter, page, pageSize]);

  async function getUsers() {
    try {
      const res = await adminApi.getUsers({
        search: query,
        role: roleFilter === 'all' ? undefined : roleFilter,
        page: page,
        limit: pageSize,
      });
      
      if (res.data?.data?.user) {
        setUsers(res.data.data.user);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  const counts = useMemo(() => {
    const total = users.length;
    const beautician = users.filter((u) => u.role === "beautician").length;
    const customer = users.filter((u) => u.role === "customer").length;
    return { total, beautician, customer };
  }, [users]);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        u.userName?.toLowerCase().includes(q) ||
        u.fullName?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q)
      );
    });
  }, [users, query, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  if (page > totalPages && totalPages > 0) {
    setPage(totalPages);
  }

  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  // Show confirmation dialog
  const toggleActive = (id: string, currentStatus: boolean) => {
    setConfirmDialog({ open: true, userId: id, currentStatus });
  };

  // Handle confirmed toggle
  const handleConfirmToggle = async () => {
    const { userId, currentStatus } = confirmDialog;
    
    try {
     
      setUsers((prev) => 
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      );
      
 
      const newStatus = currentStatus ? 'inactive' : 'active';
      await adminApi.toggleStatus({ status: newStatus }, userId);
      
    } catch (error) {
      console.error("Error toggling user status:", error);
      handleApiError(error)
      setUsers((prev) => 
        prev.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
      );
    } finally {
      setConfirmDialog({ open: false, userId: '', currentStatus: false });
    }
  };

  const gotoPage = (p: number) => {
    if (p < 1) p = 1;
    if (p > totalPages) p = totalPages;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allProps = {
    query,
    setQuery,
    roleFilter,
    setRoleFilter,
    page,
    pageSize,
    users,
    setUsers,
    counts,
    filtered,
    totalPages,
    pageData,
    toggleActive,
    gotoPage,
  };

  return (
    <>
      <UsersList {...allProps} />


<AlertDialog 
  open={confirmDialog.open} 
  onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
>
  <AlertDialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-xl">
    <AlertDialogHeader>
      <div className="flex items-center gap-3 mb-2">
        {confirmDialog.currentStatus ? (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        )}
        <AlertDialogTitle className="text-xl font-bold text-gray-900">
          {confirmDialog.currentStatus ? 'Deactivate User' : 'Activate User'}
        </AlertDialogTitle>
      </div>
      <AlertDialogDescription className="text-gray-600 text-base leading-relaxed">
        {confirmDialog.currentStatus 
          ? 'This user will lose access to their account immediately. You can reactivate them later if needed.' 
          : 'This user will regain full access to their account and all features.'}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className="mt-6 gap-3">
      <AlertDialogCancel className="px-6 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction 
        onClick={handleConfirmToggle}
        className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-sm ${
          confirmDialog.currentStatus 
            ? 'bg-red-600 hover:bg-red-700' 
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {confirmDialog.currentStatus ? 'Deactivate' : 'Activate'}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    </>
  );
}