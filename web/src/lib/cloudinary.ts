import { config } from "@/config/env"

const cloudinaryURL = `https://api.cloudinary.com/v1_1/${config.cloudinary.cloudName}/image/upload`

export type UploadedFile = {
  asset_id: string;
  url: string;
  secure_url: string;
  display_name: string;
}

export async function unsignedUpload(file: File): Promise<UploadedFile> {
  const formData = new FormData();
  formData.append('file', file)
  formData.append('upload_preset', config.cloudinary.unsignedPreset)

  const res = await fetch(cloudinaryURL, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Cloudinary upload failed: ${err}`);
  }

  return await res.json()
}
