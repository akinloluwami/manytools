import ContentLayout from "@/components/shared/content-layout";
import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg"; // Import FFmpeg

// Path to the FFmpeg core files in your public directory
const ffmpegCorePath = "/ffmpeg-core.js"; // Adjust if you placed them elsewhere

export const Route = createFileRoute("/tools/video-trimmer")({
  component: RouteComponent,
});

function RouteComponent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ffmpegRef = useRef<FFmpeg | null>(null); // Ref to store FFmpeg instance
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false); // State to track FFmpeg loading

  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTrimming, setIsTrimming] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [originalVideoFile, setOriginalVideoFile] = useState<File | null>(null); // Store the original file
  const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string | null>(null);
  const [downloadFileName, setDownloadFileName] =
    useState<string>("trimmed_video.mp4");
  const [trimmingProgress, setTrimmingProgress] = useState(0); // For potential progress display

  // Function to load FFmpeg
  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) {
      console.log("FFmpeg already initialized.");
      if (!ffmpegRef.current.isLoaded()) {
        console.log("Loading FFmpeg core...");
        try {
          await ffmpegRef.current.load();
          setFfmpegLoaded(true);
          console.log("FFmpeg core loaded successfully.");
        } catch (error) {
          console.error("Error loading FFmpeg core:", error);
          setFfmpegLoaded(false); // Ensure it's marked as not loaded on error
        }
      } else {
        setFfmpegLoaded(true);
        console.log("FFmpeg core was already loaded.");
      }
      return;
    }

    console.log("Initializing FFmpeg...");
    try {
      const ffmpegInstance = createFFmpeg({
        log: true, // Enables FFmpeg logs in the console (useful for debugging)
        corePath: ffmpegCorePath, // Path to ffmpeg-core.js
        // You might need to provide paths for ffmpeg-core.wasm and ffmpeg-core.worker.js explicitly
        // depending on your bundler and how you serve these files.
        // For Vite/Next.js placing in public and using a direct path usually works.
        // Example if corePath doesn't automatically resolve others:
        // mainName: 'ffmpeg', // often 'main' or 'ffmpeg'
        // workerPath: '/ffmpeg-core.worker.js',
        // wasmPath: '/ffmpeg-core.wasm',
      });
      ffmpegRef.current = ffmpegInstance;
      console.log("FFmpeg instance created. Loading core...");
      await ffmpegInstance.load();
      setFfmpegLoaded(true);
      console.log("FFmpeg core loaded successfully.");
    } catch (error) {
      console.error("Error initializing or loading FFmpeg:", error);
      setFfmpegLoaded(false);
    }
  }, []);

  // Load FFmpeg when the component mounts or when a video is selected
  useEffect(() => {
    loadFFmpeg();
  }, [loadFFmpeg]);

  useEffect(() => {
    const handleLoadedMetadata = () => {
      if (videoRef.current) {
        setDuration(videoRef.current.duration);
        setEndTime(videoRef.current.duration);
      }
    };
    if (videoRef.current && videoUrl) {
      videoRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        if (videoRef.current) {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          videoRef.current.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata
          );
        }
      };
    }
  }, [videoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setVideoUrl(fileURL);
      setOriginalVideoFile(file); // Store the file object
      setStartTime(0);
      setEndTime(0); // Will be updated by loadedmetadata
      setDuration(0); // Will be updated by loadedmetadata
      setIsPlaying(false);
      setTrimmedVideoUrl(null);
      setDownloadFileName(file.name.replace(/\.[^.]+$/, "") + "_trimmed.mp4");
      if (videoRef.current) {
        videoRef.current.src = fileURL;
        videoRef.current.load(); // Ensure video reloads and metadata event fires
      }
      // Ensure FFmpeg is loaded if it wasn't already
      if (!ffmpegLoaded) {
        loadFFmpeg();
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // This time update logic ensures the video plays within the selected trim range
  // It might be less critical if the main video player is just for preview before trimming.
  // After trimming, a new video player could show the trimmed result.
  const handleTimeUpdate = () => {
    if (videoRef.current && isPlaying) {
      // Only enforce if playing
      const currentTime = videoRef.current.currentTime;
      if (currentTime < startTime && startTime > 0) {
        // Allow playing before start if start is 0
        videoRef.current.currentTime = startTime;
      } else if (currentTime > endTime) {
        videoRef.current.pause();
        videoRef.current.currentTime = endTime; // or startTime
        setIsPlaying(false); // Stop playback
      }
    }
  };

  const handleStartTimeChange = useCallback(
    (newStartTime: number) => {
      if (
        newStartTime >= 0 &&
        newStartTime < endTime &&
        newStartTime < duration
      ) {
        setStartTime(newStartTime);
        if (videoRef.current) {
          videoRef.current.currentTime = newStartTime;
        }
      } else if (newStartTime === 0) {
        // Allow setting to 0
        setStartTime(0);
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }
      }
    },
    [endTime, duration]
  );

  const handleEndTimeChange = useCallback(
    (newEndTime: number) => {
      if (newEndTime > startTime && newEndTime <= duration) {
        setEndTime(newEndTime);
        // No need to jump currentTime here, user is setting the end boundary
      }
    },
    [startTime, duration]
  );

  const handleTrim = async () => {
    if (
      !originalVideoFile ||
      !ffmpegRef.current ||
      !ffmpegRef.current.isLoaded()
    ) {
      alert(
        "Video file not selected or FFmpeg is not loaded yet. Please wait or re-select the file."
      );
      if (!ffmpegRef.current?.isLoaded()) loadFFmpeg(); // Attempt to load FFmpeg if not loaded
      return;
    }

    setIsTrimming(true);
    setTrimmedVideoUrl(null); // Clear previous trimmed video
    setTrimmingProgress(0);

    const ffmpeg = ffmpegRef.current;
    const inputFileName = originalVideoFile.name;
    const outputFileName = "trimmed_" + inputFileName; // Or use downloadFileName

    try {
      console.log("Starting trim process...");
      console.log(
        `Input: ${inputFileName}, Start: ${startTime}s, End: ${endTime}s`
      );

      // 1. Write the file to FFmpeg's virtual file system
      ffmpeg.FS("writeFile", inputFileName, await fetchFile(originalVideoFile));
      console.log("File written to FFmpeg FS.");

      // Optional: Set up a progress listener
      ffmpeg.setProgress(({ ratio }) => {
        setTrimmingProgress(Math.round(ratio * 100));
        console.log(`FFmpeg progress: ${Math.round(ratio * 100)}%`);
      });

      // 2. Run the FFmpeg command
      // -ss {startTime}: Seek to start time
      // -to {endTime}: Go up to end time
      // -i {inputFileName}: Input file
      // -c copy: Copy codecs (fast, no re-encoding). This might lead to less precise cuts
      //          as it cuts on keyframes. For precise cuts, remove -c copy, but it will be much slower.
      // {outputFileName}: Output file
      console.log("Running FFmpeg command...");
      await ffmpeg.run(
        "-i",
        inputFileName,
        "-ss",
        String(startTime),
        "-to",
        String(endTime),
        "-c", // Using codec copy for speed
        "copy",
        outputFileName
      );
      console.log("FFmpeg command finished.");

      // 3. Read the result
      const data = ffmpeg.FS("readFile", outputFileName);
      console.log("Output file read from FFmpeg FS.");

      // 4. Create a Blob URL for the trimmed video
      const trimmedBlob = new Blob([data.buffer], {
        type: originalVideoFile.type || "video/mp4",
      });
      const url = URL.createObjectURL(trimmedBlob);
      setTrimmedVideoUrl(url);
      setDownloadFileName(outputFileName); // Update download name to the actual output

      // 5. Clean up files from FFmpeg's virtual file system
      ffmpeg.FS("unlink", inputFileName);
      ffmpeg.FS("unlink", outputFileName);
      console.log("FFmpeg FS cleaned up.");

      if (videoRef.current) {
        // Optionally reset main player
        videoRef.current.currentTime = 0; // or startTime of the original video
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Error during trimming process:", error);
      alert(`An error occurred during trimming: ${error}`);
    } finally {
      setIsTrimming(false);
      setTrimmingProgress(0);
    }
  };

  const handleDownload = () => {
    if (trimmedVideoUrl) {
      const a = document.createElement("a");
      a.href = trimmedVideoUrl;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Keep the URL.revokeObjectURL(trimmedVideoUrl) if you don't need the trimmed video preview anymore.
      // If you have a separate player for the trimmed video, you might want to revoke it when a new video is loaded or trimmed.
      // URL.revokeObjectURL(trimmedVideoUrl);
      // setTrimmedVideoUrl(null); // Optionally clear after download
    }
  };

  const handleDownloadFileNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDownloadFileName(event.target.value);
  };

  return (
    <ContentLayout title="Video Trimmer">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {!ffmpegLoaded && (
          <div className="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            Loading FFmpeg tools... This may take a moment.
          </div>
        )}

        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
        />

        {videoUrl && (
          <div className="relative">
            <video
              src={videoUrl}
              ref={videoRef}
              onTimeUpdate={handleTimeUpdate} // Re-evaluate if this precise control is needed or if it interferes
              onLoadedMetadata={() => {
                // Ensure metadata updates duration and endTime
                if (videoRef.current) {
                  const newDuration = videoRef.current.duration;
                  setDuration(newDuration);
                  // Only set endTime if it hasn't been manually adjusted or if it's at 0 (initial load)
                  if (endTime === 0 || endTime > newDuration) {
                    setEndTime(newDuration);
                  }
                }
              }}
              controls // Adding default controls might be more user-friendly for playback
              className="w-full rounded-md"
            />
            {/* Custom play/pause can be kept or removed if `controls` attribute is used */}
            <button
              onClick={handlePlayPause}
              className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white rounded-md p-1"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                  />{" "}
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.662-.995l11.75 7c.745.445.745 1.522 0 1.967l-11.75 7c-.745.445-1.662-.098-1.662-.995V5.653z"
                  />{" "}
                </svg>
              )}
            </button>
          </div>
        )}

        {videoUrl && (
          <div className="flex space-x-2">
            <label className="flex flex-col items-center text-sm">
              Start (sec)
              <input
                type="number"
                min={0}
                // max={endTime > 0 ? (endTime - 0.1).toFixed(1) : (duration - 0.1).toFixed(1)}
                max={Math.max(
                  0,
                  (endTime > 0 ? endTime : duration) - 0.1
                ).toFixed(1)} // Ensure max is reasonable
                step={0.1}
                value={startTime.toFixed(1)}
                onChange={(e) => handleStartTimeChange(Number(e.target.value))}
                className="w-20 p-1 border rounded mt-1"
                disabled={!ffmpegLoaded || isTrimming}
              />
            </label>
            <label className="flex flex-col items-center text-sm">
              End (sec)
              <input
                type="number"
                min={Math.min(duration, startTime + 0.1).toFixed(1)}
                max={duration.toFixed(1)}
                step={0.1}
                value={endTime.toFixed(1)}
                onChange={(e) => handleEndTimeChange(Number(e.target.value))}
                className="w-20 p-1 border rounded mt-1"
                disabled={!ffmpegLoaded || isTrimming}
              />
            </label>
          </div>
        )}

        {videoUrl && (
          <button
            onClick={handleTrim}
            disabled={isTrimming || !ffmpegLoaded || startTime >= endTime}
            className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50"
          >
            {isTrimming
              ? `Trimming... ${trimmingProgress > 0 ? trimmingProgress + "%" : ""}`
              : "Trim Video"}
          </button>
        )}

        {trimmedVideoUrl && (
          <div className="mt-4 space-y-2">
            <h3 className="text-lg font-semibold">Trimmed Video Preview:</h3>
            <video
              src={trimmedVideoUrl}
              controls
              className="w-full rounded-md"
            />
            <label
              htmlFor="downloadFileName"
              className="block text-sm font-medium text-gray-700"
            >
              Download File Name:
            </label>
            <input
              type="text"
              id="downloadFileName"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              value={downloadFileName}
              onChange={handleDownloadFileNameChange}
            />
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Download Trimmed Video
            </button>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
