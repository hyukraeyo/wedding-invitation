-- 1. 'images' 버킷 생성 (이미 존재하면 무시)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. 인증된 사용자가 'images' 버킷에 파일을 업로드(INSERT)할 수 있도록 허용
CREATE POLICY "인증된 사용자 업로드 허용" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'images');

-- 3. 누구나 'images' 버킷의 파일을 볼 수 있도록 허용 (SELECT)
CREATE POLICY "이미지 전체 공개 조회 허용"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 4. 본인이 올린 이미지는 수정(UPDATE)할 수 있도록 허용
CREATE POLICY "본인 이미지 수정 허용"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner);

-- 5. 본인이 올린 이미지는 삭제(DELETE)할 수 있도록 허용
CREATE POLICY "본인 이미지 삭제 허용"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid() = owner);
