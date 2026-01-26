import { apiFetch } from "./api/apiFetch";

type PresignedData = {
  uploadUrl: string;
  key: string;
  headers: Record<string, string[]>;
};

function buildPublicUrlFromPresigned(uploadUrl: string) {
  return uploadUrl.split("?")[0];
}

function toPutHeaders(headers: Record<string, string[]>) {
  const result: Record<string, string> = {};

  const blocked = new Set(["host"]);

  for (const [k, v] of Object.entries(headers)) {
    const key = k.toLowerCase();
    if (blocked.has(key)) continue;
    if (v?.[0]) result[key] = v[0];
  }

  return result;
}

export async function uploadImageToS3(params: { file: File; directory: string }) {
  const { file, directory } = params;

  const payload = {
    directory: directory,
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size,
  };

  const presigned = await apiFetch<PresignedData>("/uploads/presigned-url", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const { uploadUrl, key, headers } = presigned;

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: toPutHeaders(headers),
    body: file,
  });

  if (!uploadResponse) {
    throw new Error(`S3 이미지 업로드 실패: ${uploadResponse}`);
  }

  return {
    key,
    publicUrl: buildPublicUrlFromPresigned(uploadUrl),
  };
}
