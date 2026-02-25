import React from 'react';
import Image from 'next/image';
import { useInvitationStore } from '@/store/useInvitationStore';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { EditorSection } from '@/components/ui/EditorSection';
import { TextField } from '@/components/ui/TextField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { Field } from '@/components/ui/Field';
import { ImageUploader } from '@/components/common/ImageUploader';
import { SectionSampleDialogAction } from '@/components/common/SectionSampleDialogAction';
import { Button } from '@/components/ui/Button';
import { FormControl, FormField, FormLabel } from '@/components/ui/Form';
import { useBuilderSection } from '@/hooks/useBuilder';
import { cn } from '@/lib/utils';
import { KAKAO_SHARE_SAMPLES } from '@/constants/samples';
import type { SectionProps, SamplePhraseItem } from '@/types/builder';
import { Dialog } from '@/components/ui/Dialog';
import styles from './KakaoShareSection.module.scss';

export default function KakaoShareSection(props: SectionProps) {
  const kakao = useInvitationStore((state) => state.kakaoShare);
  const setKakao = useInvitationStore((state) => state.setKakao);
  const { isInvalid } = useBuilderSection(props.value);
  const previewImageClassName = cn(
    styles.imageWrapper,
    kakao.imageRatio === 'portrait' ? styles.portrait : styles.landscape
  );
  const previewButtonType = kakao.buttonType || 'location';
  const previewTitle = kakao.title.trim() || '우리 결혼해요';
  const previewDescription = kakao.description.trim() || '귀한 걸음 하시어 축복해 주세요.';
  const previewActionLabel = previewButtonType === 'location' ? '위치 안내' : '참석 여부';

  const handleSelectSample = (sample: SamplePhraseItem) => {
    setKakao({
      title: sample.title,
      description: sample.subtitle || sample.content || '', // Map subtitle or content to description
    });
  };

  return (
    <EditorSection
      title="카카오 초대장 썸네일"
      isInvalid={isInvalid}
      rightElement={
        <SectionSampleDialogAction items={KAKAO_SHARE_SAMPLES} onSelect={handleSelectSample} />
      }
    >
      <div className={styles.container}>
        {/* Photo Upload */}
        <FormField name="kakao-image">
          <FormLabel htmlFor="kakao-image">사진</FormLabel>
          <ImageUploader
            id="kakao-image"
            value={kakao.imageUrl}
            onChange={(url) => setKakao({ imageUrl: url })}
            aspectRatio={kakao.imageRatio === 'portrait' ? '3/4' : '16/9'}
            placeholder="썸네일 추가"
            ratio={kakao.imageRatio || 'landscape'}
            onRatioChange={(val) => setKakao({ imageRatio: val as 'portrait' | 'landscape' })}
            ratioOptions={[
              { label: '세로형', value: 'portrait' },
              { label: '가로형', value: 'landscape' },
            ]}
          />
          <Field.Footer>
            <Field.HelperText>카카오톡 공유 메시지에서 보여질 사진의 비율이에요.</Field.HelperText>
          </Field.Footer>
        </FormField>

        <FormField name="kakao-title">
          <FormLabel htmlFor="kakao-title">제목</FormLabel>
          <FormControl asChild>
            <TextField
              id="kakao-title"
              type="text"
              placeholder="예: 우리 결혼해요"
              value={kakao.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setKakao({ title: e.target.value })
              }
              maxLength={25}
            />
          </FormControl>
        </FormField>

        <FormField name="kakao-description">
          <FormLabel htmlFor="kakao-description">설명</FormLabel>
          <FormControl asChild>
            <TextField
              id="kakao-description"
              type="text"
              placeholder="예: 2024년 10월 12일"
              value={kakao.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setKakao({ description: e.target.value })
              }
              maxLength={35}
            />
          </FormControl>
        </FormField>

        <FormField name="kakao-button-type">
          <FormLabel>버튼 스타일</FormLabel>
          <SegmentedControl
            alignment="fluid"
            value={kakao.buttonType || 'location'}
            onChange={(val: string) =>
              setKakao({ buttonType: val as 'location' | 'rsvp' | 'none' })
            }
          >
            <SegmentedControl.Item value="location">위치 안내</SegmentedControl.Item>
            <SegmentedControl.Item value="rsvp">참석 여부</SegmentedControl.Item>
            <SegmentedControl.Item value="none">사용 안함</SegmentedControl.Item>
          </SegmentedControl>
        </FormField>
        <FormField name="kakao-button-type">
          <Dialog mobileBottomSheet>
            <Dialog.Trigger asChild>
              <Button type="button" variant="secondary" fullWidth>
                미리보기
              </Button>
            </Dialog.Trigger>
            <Dialog.Content aria-label="카카오톡 공유 미리보기">
              <Dialog.Header title="카카오톡 공유 미리보기" />
              <Dialog.Body>
                <article className={styles.card}>
                  {kakao.imageUrl ? (
                    <div className={previewImageClassName}>
                      <Image
                        src={kakao.imageUrl}
                        alt="Kakao Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className={styles.cardImage}
                      />
                    </div>
                  ) : (
                    <div className={previewImageClassName}>
                      <div className={styles.placeholder}>
                        <MessageCircle size={32} className={styles.placeholderIcon} />
                      </div>
                    </div>
                  )}
                  <div className={styles.cardContent}>
                    <h4 className={styles.cardTitle}>{previewTitle}</h4>
                    <p className={styles.cardDescription}>{previewDescription}</p>
                  </div>
                  <div className={styles.btnGroup}>
                    <div className={styles.cardBtn}>모바일 초대장</div>
                    {previewButtonType !== 'none' && (
                      <div className={styles.cardBtn}>{previewActionLabel}</div>
                    )}
                  </div>
                  <div className={styles.cardFooter}>
                    <div className={styles.footerBrand}>
                      <Image
                        src="/logo.png"
                        alt="logo"
                        width={14}
                        height={14}
                        className={styles.footerLogo}
                      />
                      <span className={styles.footerText}>바나나 웨딩</span>
                    </div>
                    <ChevronRight size={12} className={styles.footerChevron} />
                  </div>
                </article>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.Close asChild>
                  <Button variant="soft" className={styles.fullWidth}>
                    닫기
                  </Button>
                </Dialog.Close>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog>
        </FormField>
      </div>
    </EditorSection>
  );
}
