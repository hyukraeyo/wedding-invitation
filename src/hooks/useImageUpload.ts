import { useState, ChangeEvent, useCallback, useEffect, useRef } from 'react';

interface UseImageUploadOptions {
  initialImages?: string[];
  mode?: 'single' | 'multiple';
  maxCount?: number; // Only for multiple
  maxSizeMB?: number;
  onError?: (message: string) => void;
}

export const useImageUpload = ({
  initialImages = [],
  mode = 'multiple',
  maxCount = 10,
  maxSizeMB = 10,
  onError,
}: UseImageUploadOptions = {}) => {
  const [images, setImages] = useState<string[]>(initialImages);

  // Cleanup object URLs on unmount
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((url) => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  // Actually, we should revoke only when an image is removed or replaced.
  // But for complexity, cleaning up all on unmount is a safe baseline.
  // To be precise: we should revoke the specific URL when it is removed from state.

  const handleUpload = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const validFiles = fileArray.filter((file) => {
        // 이미지 타입 체크
        if (!file.type.startsWith('image/')) {
          onError?.('이미지 파일만 업로드할 수 있습니다.');
          return false;
        }

        // 용량 체크
        if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
          onError?.(`이미지 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));

      setImages((prev) => {
        if (mode === 'single') {
          // Revoke previous single image if it was a blob
          if (prev[0]?.startsWith('blob:')) {
            URL.revokeObjectURL(prev[0]);
          }
          return [newImageUrls[0]!];
        }

        const remainingSlots = maxCount - prev.length;
        if (remainingSlots <= 0) {
          onError?.(`최대 ${maxCount}장까지만 업로드할 수 있습니다.`);
          // Free unused urls
          newImageUrls.forEach((url) => URL.revokeObjectURL(url));
          return prev;
        }

        const imagesToAdd = newImageUrls.slice(0, remainingSlots);
        // Free extra urls
        newImageUrls.slice(remainingSlots).forEach((url) => URL.revokeObjectURL(url));

        return [...prev, ...imagesToAdd];
      });

      // 동일한 파일 재업로드를 위해 value 초기화
      e.target.value = '';
    },
    [mode, maxCount, maxSizeMB, onError]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const urlToRemove = prev[index];
      if (urlToRemove?.startsWith('blob:')) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const newList = [...prev];
      const [movedItem] = newList.splice(fromIndex, 1);
      if (movedItem) {
        newList.splice(toIndex, 0, movedItem);
      }
      return newList;
    });
  }, []);

  return {
    images,
    setImages,
    handleUpload,
    removeImage,
    moveImage,
    count: images.length,
    isFull: mode === 'multiple' && images.length >= maxCount,
  };
};
