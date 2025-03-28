"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Trash2,
  CalendarClock,
  ArrowUpDown,
  MoveUp,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Video } from "@/types/video";
import { DeleteVideoDialog } from "./delete-video-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { VideoPlayerModal } from "@/components/public-cms-components/video-player";

type SortOption = "date" | "views" | "likes" | "comments";

const videoData = [
  {
    title: "Delicious Pasta Recipe",
    thumbnail: "/food-list.png",
    category: "Food",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "Top 10 Coding Tips",
    thumbnail: "/food-list.png",
    category: "Education",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "Traveling to Japan",
    thumbnail: "/food-list.png",
    category: "Travel",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "Best Workout Routines",
    thumbnail: "/food-list.png",
    category: "Fitness",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "How to Bake a Cake",
    thumbnail: "/food-list.png",
    category: "Food",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "Mastering React.js",
    thumbnail: "/food-list.png",
    category: "Technology",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "Exploring Space",
    thumbnail: "/food-list.png",
    category: "Science",
    videoUrl: "/videos/pasta.mp4",
  },
  {
    title: "Yoga for Beginners",
    thumbnail: "/food-list.png",
    category: "Wellness",
    videoUrl: "/videos/pasta.mp4",
  },
];

export function VideoList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    videoId: string | null;
    videoTitle: string;
  }>({
    open: false,
    videoId: null,
    videoTitle: "",
  });

  // State for the video modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
   const [boostedVideos, setBoostedVideos] = useState<Record<string, boolean>>(
     {}
  );
  
  const toggleBoost = (videoId: string) => {
    setBoostedVideos((prev) => ({
      ...prev,
      [videoId]: !prev[videoId], // Toggle only for this video
    }));
  };

  useEffect(() => {
    const generatedVideos: Video[] = videoData.map((video, index) => ({
      id: `video-${index + 1}`,
      title: video.title,
      category: video.category,
      times: Math.floor(Math.random() * 5) + 1,
      publish: "Published",
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      comments: Math.floor(Math.random() * 100),
      publishDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString(),
      thumbnail: video.thumbnail,
      status: "published",
      videoUrl: video.videoUrl,
    }));

    setVideos(generatedVideos);
  }, []);

  const handleThumbnailClick = (video: Video) => {
    setSelectedVideo(video);
    setModalOpen(true);
  };

  const filteredAndSortedVideos = useMemo(() => {
    let result = videos;

    // Filter videos based on search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      result = result.filter(
        (video) =>
          video.title.toLowerCase().includes(lowerCaseQuery) ||
          video.category.toLowerCase().includes(lowerCaseQuery)
      );
    }

    // Sort videos
    result.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.publishDate).getTime() -
            new Date(a.publishDate).getTime()
          );
        case "views":
          return b.views - a.views;
        case "likes":
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    return result;
  }, [videos, searchQuery, sortBy]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSort = (value: string) => {
    setSortBy(value as SortOption);
  };

  const handleDeleteClick = (video: Video) => {
    setDeleteDialog({
      open: true,
      videoId: video.id,
      videoTitle: video.title,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.videoId) {
      // Filter out the deleted video
      const updatedVideos = videos.filter(
        (video) => video.id !== deleteDialog.videoId
      );
      setVideos(updatedVideos);
    }
    setDeleteDialog({ open: false, videoId: null, videoTitle: "" });
  };

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-end pb-6">
        {" "}
        <button className="text-secondarycolor text-sm font-bold cursor-pointer flex items-center gap-1">
          See All
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="w-full flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Uploaded Videos</h2>
        <div className="flex gap-4">
          <div className="relative ">
            <Search className="absolute right-2 top-4 h-4 w-4" />
            <Input
              placeholder="Search by title or category"
              value={searchQuery}
              onChange={handleSearch}
              className="border border-borderColor1 w-96 h-12 focus:!outline-none focus:!ring-0 rounded-md"
            />
          </div>
          <Select onValueChange={handleSort} defaultValue="date">
            <SelectTrigger className="w-[80px] h-12 border border-borderColor1 rounded-md focus:!outline-none focus:!ring-0">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="views">Views</SelectItem>
              <SelectItem value="likes">Likes</SelectItem>
              <SelectItem value="comments">Comments</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Table className="w-full overflow-x-auto">
          <TableHeader>
            <TableRow className="border-b border-secondarycolor">
              <TableHead className="w-[150px] text-blackcolor flex items-center justify-center gap-5">
                <ArrowUpDown size={18} />
                <Search size={18} />
              </TableHead>
              <TableHead className="w-[200px] text-left text-blackcolor font-semibold">
                Name
              </TableHead>
              <TableHead className="w-[200px] text-center text-blackcolor font-semibold">
                Times Published
              </TableHead>
              <TableHead className="w-[200px] text-blackcolor text-center font-semibold">
                Status
              </TableHead>
              <TableHead className="w-[200px] text-center text-blackcolor font-semibold">
                Impressions
              </TableHead>
              <TableHead className="w-[200px] text-center text-blackcolor font-semibold">
                Likes
              </TableHead>
              <TableHead className="w-[200px] text-center text-blackcolor font-semibold">
                Comments
              </TableHead>
              <TableHead className="w-[220px] text-blackcolor font-semibold text-center">
                Date
              </TableHead>
              <TableHead className="w-[80px] text-center text-blackcolor font-semibold"></TableHead>
              <TableHead className="w-[80px] text-center text-blackcolor font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedVideos.map((video) => (
              <TableRow key={video.id} className="border-none">
                <TableCell className="w-[100px]">
                  {/* Thumbnail Image */}
                  <div
                    className="w-40 h-24 rounded-lg overflow-hidden"
                    onClick={() => handleThumbnailClick(video)}
                  >
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>

                <TableCell>
                  {/* Video Info */}
                  <h3 className="font-normal text-base truncate w-full">
                    {video.title}
                  </h3>
                  <p className="text-base font-normal text-mediumgray2">
                    {video.category}
                  </p>
                </TableCell>

                <TableCell className="text-center">
                  <span>{video.times}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className=" text-success font-semibold">
                    {video.publish}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span>{video.views}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span>{video.likes}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span>{video.comments}</span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="whitespace-nowrap">
                    {new Date(video.publishDate).toISOString().split("T")[0]}
                  </span>
                </TableCell>

                <TableCell className="">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <CalendarClock className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => handleDeleteClick(video)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <button
                    className={`w-24 h-11 rounded-md flex items-center justify-center gap-2 text-whitecolor ${
                      boostedVideos[video.id] ? "bg-redcolor" : "bg-skycolor"
                    }`}
                    onClick={() => toggleBoost(video.id)}
                  >
                    {boostedVideos[video.id] ? (
                      <X size={15} />
                    ) : (
                      <MoveUp size={15} />
                    )}
                    {boostedVideos[video.id] ? "Stop" : "Boost"}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Video Modal */}
        <VideoPlayerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          video={selectedVideo}
        />
      </div>
      {filteredAndSortedVideos.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No videos found.
        </p>
      )}
      <DeleteVideoDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        onConfirm={handleDeleteConfirm}
        videoTitle={deleteDialog.videoTitle}
      />
    </div>
  );
}
