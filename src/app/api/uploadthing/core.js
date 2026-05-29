import { createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  resumeUploader: f({
    pdf: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      try {
        const { userId } = await auth();

        console.log("UploadThing Clerk userId:", userId);

        if (!userId) {
          throw new UploadThingError("Unauthorized. Please login first.");
        }

        return {
          userId,
        };
      } catch (error) {
        console.error("UploadThing middleware error:", error);

        throw new UploadThingError(
          error.message || "Failed to authenticate upload request"
        );
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.ufsUrl);

      return {
        uploadedBy: metadata.userId,
        fileUrl: file.ufsUrl,
        fileName: file.name,
      };
    }),
};