import React from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "../../../components/ui/table";
import type { IUserDto } from "../../../types/dtos/user";
import { SaidBar } from "../../user/component/saidBar/saidbar";

/** User type definition */


type UsersDetailDesignProps = {
  query: string;
  setQuery: (q: string) => void;
  roleFilter: "all" | "beautician" | "customer";
  setRoleFilter: (r: "all" | "beautician" | "customer") => void;
  page: number;
  counts: { total: number; customer: number; beautician: number };
  pageData: IUserDto[];
  totalPages: number;
  toggleActive:  (id: string, currentStatus: boolean) => void; 
  gotoPage: (p: number) => void;
};

export default function UsersList(props: UsersDetailDesignProps) {
  const {
    query,
    setQuery,
    roleFilter,
    setRoleFilter,
    page,
    counts,
    pageData,
    totalPages,
    toggleActive,
    gotoPage,
  } = props;

  return (
    <>
      {console.log(`pageData`,pageData)}
   <SaidBar/>
    <div className="min-h-screen bg-gray-50 p-6 ml-60">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users Detail</h1>
        <p className="text-sm text-gray-500">View and control all Users.</p>
      </div>

      {/* Stats Cards and Search */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for user"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <Card className="min-w-[140px]">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-gray-900">{counts.total}</div>
              <div className="text-sm text-gray-500">Total user</div>
            </CardContent>
          </Card>
          <Card className="min-w-[140px]">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-gray-900">{counts.customer}</div>
              <div className="text-sm text-gray-500">Customer</div>
            </CardContent>
          </Card>
          <Card className="min-w-[140px]">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-gray-900">{counts.beautician}</div>
              <div className="text-sm text-gray-500">Beauticians</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setRoleFilter("all")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            roleFilter === "all"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setRoleFilter("beautician")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            roleFilter === "beautician"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          beautician
        </button>
        <button
          onClick={() => setRoleFilter("customer")}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            roleFilter === "customer"
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          customer
        </button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-lg">Users details</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>user-id</TableHead>
                <TableHead>user_name</TableHead>
                <TableHead>fullname</TableHead>
                <TableHead>email</TableHead>
                <TableHead className="text-right">Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            
              {pageData.map((user) => (
                <TableRow key={user.id}>
                 
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.userName}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                   <TableCell>{user.email}</TableCell>
                  <TableCell className="text-right">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={user.isActive ?? false}
                        onChange={() => toggleActive(user.id, user.isActive ?? false)}
                        className="sr-only peer"
                      />
                      <div
                        className={`w-11 h-6 rounded-full peer transition-colors ${
                          user.isActive ? "bg-red-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
                            user.isActive ? "translate-x-5" : ""
                          }`}
                        ></div>
                      </div>
                    </label>
                  </TableCell>
                </TableRow>
              ))}
              {pageData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, idx) => {
          const p = idx + 1;
          return (
            <button
              key={p}
              onClick={() => gotoPage(p)}
              className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                p === page
                  ? "bg-blue-200 text-blue-700"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          );
        })}
        {totalPages > 0 && page < totalPages && (
          <button
            onClick={() => gotoPage(page + 1)}
            className="w-10 h-10 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 flex items-center justify-center"
          >
            →
          </button>
        )}
      </div>
    </div>
     </>
  );
}