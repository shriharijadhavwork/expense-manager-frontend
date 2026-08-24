import { appConfig } from "@/config/env";
import { apiRequest, ApiError, getStoredToken } from "@/lib/api/client";
import type { ApiErrorBody, ApiSuccessBody, UploadedFile } from "@/types/api";

export const filesApi = {
  getById(id: string): Promise<UploadedFile> {
    return apiRequest<UploadedFile>(`/files/${id}`);
  },

  upload(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<UploadedFile> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      xhr.open("POST", `${appConfig.apiUrl}/files/upload`);
      xhr.responseType = "json";

      const token = getStoredToken();
      if (token) {
        xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (!onProgress || !event.lengthComputable) {
          return;
        }

        onProgress(Math.round((event.loaded / event.total) * 100));
      };

      xhr.onload = () => {
        const payload = xhr.response as ApiSuccessBody<UploadedFile> | ApiErrorBody | null;

        if (xhr.status >= 200 && xhr.status < 300) {
          if (payload && "success" in payload && payload.success) {
            resolve(payload.data);
            return;
          }

          reject(
            new ApiError(
              xhr.status,
              "REQUEST_FAILED",
              "Upload completed but returned an unexpected response.",
            ),
          );
          return;
        }

        reject(
          new ApiError(
            xhr.status,
            payload && "error" in payload
              ? payload.error.code
              : "REQUEST_FAILED",
            payload && "error" in payload
              ? payload.error.message
              : "Upload failed. Please try again.",
            payload && "error" in payload ? payload.error.details : undefined,
          ),
        );
      };

      xhr.onerror = () => {
        reject(
          new ApiError(
            0,
            "NETWORK_ERROR",
            "Unable to reach the server. Check your connection and try again.",
          ),
        );
      };

      xhr.send(formData);
    });
  },
};
