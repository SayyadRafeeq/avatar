"use client";

import PublicSidebar from "@/components/PublicSidebar";
import { useRouter } from "next/navigation";
import { User, Bell } from "lucide-react";
import { ShedulingVideoList } from "@/components/public-cms-components/sheduling-video-list";

export default function ContentSheduling() {
  const router = useRouter();
  return (
    <>
      <div className="flex h-screen">
        <PublicSidebar />
        <div className="flex-1 h-full px-2 overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center h-32 pt-5 px-7 rounded-md">
            <div className="flex flex-col items-start gap-1 w-full">
              <h2 className="text-2xl font-semibold mb-2 flex items-center justify-between w-full">
                <div className="flex items-center">
                  <User className="mr-2 h-6 w-6 text-black" />
                  <span>Content</span>
                </div>
                <a href="/notification">
                  <Bell className="h-5 w-5 text-black cursor-pointer" />
                </a>
              </h2>
              <div className="text-black ml-4 flex items-center gap-3">
                <span
                  onClick={() => router.push("/content-management")}
                  className="cursor-pointer"
                >
                  Content
                </span>
                <span>&gt;</span>
                <span
                  className="cursor-pointer"
                  onClick={() => router.push("/content-scheduling")}
                >
                  Scheduling
                </span>
              </div>
            </div>
          </div>
          {/* Content */}
          <div className="bg-gray-100 py-7 px-7 h-[calc(100%-128px)] overflow-y-auto scroll">
            <div className="bg-white rounded-lg shadow-md px-4 py-3 mx-auto">
              <div className="border-b border-secondarycolor pb-4">
                <h2 className="text-lg font-semibold">Content Scheduling</h2>
                <p className="font-normal text-sm">
                  Plan and manage when your Avatar content gets published.
                </p>
              </div>
              <ShedulingVideoList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
