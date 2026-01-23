-- 1. 'images' 버킷에 대한 익명 사용자(anon) 업로드 허용
CREATE POLICY "익명 사용자 업로드 허용"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'images');

-- 2. 'images' 버킷에 대한 익명 사용자(anon) 조회 허용 (이미 public 이지만 명시적으로 추가)
CREATE POLICY "익명 사용자 조회 허용"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'images');

-- 3. 'invitations' 테이블에 대한 익명 사용자(anon) 생성 허용
-- user_id가 null인 경우에만 익명 생성을 허용합니다.
CREATE POLICY "익명 사용자 생성 허용"
ON public.invitations FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- 4. 'invitations' 테이블에 대한 익명 사용자(anon) 조회 허용
CREATE POLICY "익명 사용자 조회 허용"
ON public.invitations FOR SELECT
TO anon
USING (true);

-- 5. 'invitations' 테이블에 대한 익명 사용자(anon) 수정 허용
-- 자신이 만든(user_id가 null인) 항목에 대해 수정을 허용합니다.
-- (실제 서비스에서는 슬러그 유추를 통한 공격 위험이 있으나 테스트 환경을 위해 허용)
CREATE POLICY "익명 사용자 수정 허용"
ON public.invitations FOR UPDATE
TO anon
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);
