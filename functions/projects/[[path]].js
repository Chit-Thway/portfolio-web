import { serveProjectVideo } from "../../server/project-video.js";

const projectVideoPaths = new Set([
  "/projects/job-application-tracker/demonstration.mp4",
  "/projects/windows-storage-extension/demonstration.mp4",
  "/projects/windows-support-toolkit/demonstration.mp4",
]);

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  if (
    !projectVideoPaths.has(pathname) ||
    !["GET", "HEAD"].includes(context.request.method)
  ) {
    return context.next();
  }

  return serveProjectVideo(context.request, context.env.ASSETS);
}
