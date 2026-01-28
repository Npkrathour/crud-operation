"use client";
export const dynamic = "force-dynamic";

import { SquarePen, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

type Student = {
  id: number;
  name: string;
  email: string;
  number: string;
  desc: string;
};

const SkeletonRow = () => (
  <tr className="animate-pulse text-center">
    {Array.from({ length: 6 }).map((_, i) => (
      <td key={i} className="border px-4 py-3">
        <div className="h-4 w-full rounded bg-gray-700" />
      </td>
    ))}
  </tr>
);

const CrudList = () => {
  const router = useRouter();

  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchStudents = async (page: number) => {
    setLoading(true);

    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    const { data, error, count } = await supabase
      .from("student_table")
      .select("*", { count: "exact" })
      .order("id", { ascending: false })
      .range(from, to);

    if (error) {
      toast.error(error.message);
    } else {
      setData(data || []);
      setTotalCount(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchStudents(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase
      .from("student_table")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Deleted successfully");
      fetchStudents(currentPage);
    }
  };

  const actionsButtons = [
    {
      name: "Edit",
      icon: SquarePen,
      onClick: (id: number) => router.push(`/crudlist/edit/${id}`),
    },
    {
      name: "Delete",
      icon: Trash,
      onClick: handleDelete,
    },
  ];

  return (
    <div className="text-white max-w-7xl w-full mx-auto p-5 space-y-5">
      <div className="flex md:flex-row flex-col md:items-center md:justify-between gap-4 w-full">
        <h1 className="md:text-xl text-md font-normal">
          All records in one place Create, Update, and Delete.
        </h1>
        <Button
          className="px-4 py-2 border border-gray-500 hover:bg-gray-800 rounded-md"
          onClick={() => router.push("/crudlist/create")}
        >
          Create New Entry
        </Button>
      </div>

      <div className="w-full ">
        <table className="w-full border border-gray-400">
          <thead>
            <tr className="bg-gray-900 text-center">
              <th className="border px-4 py-3">ID</th>
              <th className="border px-4 py-3">Name</th>
              <th className="border px-4 py-3">Email</th>
              <th className="border px-4 py-3">Phone</th>
              <th className="border px-4 py-3">Description</th>
              <th className="border px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: itemsPerPage }).map((_, i) => (
                <SkeletonRow key={i} />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((student) => (
                <tr key={student.id} className="whitespace-nowrap">
                  <td className="border px-4  py-3">{student.id}</td>
                  <td className="border px-4 py-3">{student.name}</td>
                  <td className="border px-4 py-3">{student.email}</td>
                  <td className="border px-4 py-3">{student.number}</td>
                  <td className="border px-4 py-3">
                    {student.desc?.split(" ").slice(0, 7).join(" ")}...
                  </td>
                  <td className="border px-4 py-3">
                    <div className="flex justify-center gap-2">
                      {actionsButtons.map((action) => (
                        <Tooltip key={action.name}>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => action.onClick(student.id)}
                            >
                              <action.icon className="size-7 border border-gray-700 rounded-sm p-1.5 hover:border-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{action.name}</TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-5">
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-10 disabled:opacity-50"
          >
            Prev
          </Button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-10 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CrudList;
