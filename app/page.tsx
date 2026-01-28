"use client";
import React from "react";
import CrudList from "./crudlist/page";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const page = () => {
  const router = useRouter();
  return (
    <div className=" grid w-full h-screen justify-center content-center text-white">
      <Button
        onClick={() => router.push("crudlist")}
        className="border border-gray-600  hover:border-gray-500"
      >
        Go to the List
      </Button>
    </div>
  );
};

export default page;
