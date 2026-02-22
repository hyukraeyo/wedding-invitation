import { getBrowserSupabaseClient } from '@/lib/supabase';

/**
 * Uploads a file to Supabase Storage and returns the public URL.
 * @param file The file to upload
 * @param bucket The bucket name (default: 'images')
 * @param folder Optional folder path within the bucket
 */
export async function uploadImage(
  file: File,
  bucket: string = 'images',
  folder: string = 'uploads'
): Promise<string> {
  try {
    const supabase = await getBrowserSupabaseClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 11)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
