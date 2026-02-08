import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ImageUploader } from '@/components/common/ImageUploader';
import { StylePicker, type StyleOption } from '@/components/common/StylePicker';
import { STYLE_PRESETS } from '@/constants/samples';
import { isRequiredField } from '@/constants/requiredFields';
import { FormControl, FormField, FormHeader, FormLabel, FormMessage } from '@/components/ui/Form';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { SwitchRow } from '@/components/common/SwitchRow';
import { TextField } from '@/components/ui/TextField';
import { VisuallyHidden } from '@/components/ui/VisuallyHidden';
import { useInvitationStore } from '@/store/useInvitationStore';
import styles from './MainScreenSection.module.scss';

export default function MainScreenSectionContent() {
  const {
    mainScreen,
    setMainScreen,
    theme,
    setTheme,
    groom,
    bride,
    imageUrl,
    setImageUrl,
    imageRatio,
    setImageRatio,
    validationErrors,
    removeValidationError,
  } = useInvitationStore(
    useShallow((state) => ({
      mainScreen: state.mainScreen,
      setMainScreen: state.setMainScreen,
      theme: state.theme,
      setTheme: state.setTheme,
      groom: state.groom,
      bride: state.bride,
      imageUrl: state.imageUrl,
      setImageUrl: state.setImageUrl,
      imageRatio: state.imageRatio,
      setImageRatio: state.setImageRatio,
      validationErrors: state.validationErrors,
      removeValidationError: state.removeValidationError,
    }))
  );

  const updateMain = (data: Partial<typeof mainScreen>) => setMainScreen(data);

  const styleOptions = React.useMemo<StyleOption[]>(
    () =>
      STYLE_PRESETS.map((preset) => ({
        id: preset.layout,
        label: preset.label,
        type: preset.layout === 'classic' ? 'classic1' : 'placeholder',
        isComingSoon: preset.isComingSoon,
      })),
    []
  );

  return (
    <div className={styles.container}>
      <FormField name="main-image">
        <FormHeader>
          <FormLabel htmlFor="main-image">메인 사진</FormLabel>
          <FormMessage forceMatch={validationErrors.includes('main-image') && !imageUrl}>
            필수 항목이에요.
          </FormMessage>
        </FormHeader>
        <ImageUploader
          id="main-image"
          value={imageUrl}
          onChange={(val) => {
            setImageUrl(val);
            removeValidationError('main-image');
          }}
          placeholder="메인 이미지를 추가하세요"
          ratio={imageRatio}
          onRatioChange={(value) => setImageRatio(value as 'fixed' | 'auto')}
          aspectRatio="2/1"
          invalid={validationErrors.includes('main-image')}
        />
        <FormControl asChild>
          <VisuallyHidden asChild>
            <input
              id="main-image"
              aria-label="메인 사진"
              required={isRequiredField('mainImage')}
              readOnly
              value={imageUrl || ''}
            />
          </VisuallyHidden>
        </FormControl>
      </FormField>

      <SwitchRow
        label="사진 꽉 채우기"
        checked={mainScreen.expandPhoto}
        onCheckedChange={(checked) => updateMain({ expandPhoto: checked })}
      />

      <FormField name="style-picker">
        <FormLabel>스타일</FormLabel>
        <StylePicker
          value={mainScreen.layout}
          options={styleOptions}
          onChange={(selectedLayout) => {
            if (selectedLayout === mainScreen.layout) return;

            const selectedPreset = STYLE_PRESETS.find((preset) => preset.layout === selectedLayout);
            if (!selectedPreset || selectedPreset.isComingSoon) return;

            updateMain({
              layout: selectedPreset.layout as typeof mainScreen.layout,
              imageShape: selectedPreset.imageShape as typeof mainScreen.imageShape,
            });
          }}
        />
      </FormField>

      <FormField name="theme-effect">
        <FormLabel>날림 효과</FormLabel>
        <SegmentedControl
          alignment="fluid"
          value={theme.effect}
          onChange={(value: string) =>
            setTheme({ effect: value as 'none' | 'cherry-blossom' | 'snow' })
          }
        >
          <SegmentedControl.Item value="none">없음</SegmentedControl.Item>
          <SegmentedControl.Item value="cherry-blossom">벚꽃</SegmentedControl.Item>
          <SegmentedControl.Item value="snow">눈내림</SegmentedControl.Item>
        </SegmentedControl>
      </FormField>

      {mainScreen.layout === 'classic' ? (
        <FormField name="image-shape">
          <FormLabel>사진 형태</FormLabel>
          <SegmentedControl
            alignment="fluid"
            value={mainScreen.imageShape || 'rect'}
            onChange={(value: string) =>
              updateMain({ imageShape: value as 'rect' | 'arch' | 'oval' })
            }
          >
            <SegmentedControl.Item value="rect">기본</SegmentedControl.Item>
            <SegmentedControl.Item value="arch">아치</SegmentedControl.Item>
            <SegmentedControl.Item value="oval">타원</SegmentedControl.Item>
          </SegmentedControl>
        </FormField>
      ) : null}

      <FormField name="main-effect">
        <FormLabel>사진 효과</FormLabel>
        <SegmentedControl
          alignment="fluid"
          value={mainScreen.effect}
          onChange={(value: string) => updateMain({ effect: value as 'none' | 'mist' | 'ripple' })}
        >
          <SegmentedControl.Item value="none">없음</SegmentedControl.Item>
          <SegmentedControl.Item value="mist">안개</SegmentedControl.Item>
          <SegmentedControl.Item value="ripple">물결</SegmentedControl.Item>
        </SegmentedControl>
      </FormField>

      {mainScreen.layout === 'classic' ? (
        <>
          <FormField name="main-title">
            <FormLabel htmlFor="main-title">제목</FormLabel>
            <FormControl asChild>
              <TextField
                id="main-title"
                placeholder="예: THE MARRIAGE"
                value={mainScreen.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateMain({ title: e.target.value })
                }
              />
            </FormControl>
          </FormField>

          <FormField name="main-subtitle">
            <FormLabel htmlFor="main-subtitle">소제목</FormLabel>
            <FormControl asChild>
              <TextField
                id="main-subtitle"
                placeholder="예: 두 사람의 결혼식에 초대합니다"
                value={mainScreen.subtitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateMain({ subtitle: e.target.value })
                }
              />
            </FormControl>
          </FormField>

          <FormField name="main-names">
            <FormLabel>표시 이름</FormLabel>
            <div className={styles.rowLayout}>
              <FormControl asChild>
                <TextField
                  placeholder={
                    groom.lastName || groom.firstName
                      ? `${groom.lastName}${groom.firstName}`
                      : '신랑'
                  }
                  value={mainScreen.groomName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateMain({ groomName: e.target.value })
                  }
                />
              </FormControl>
              <FormControl asChild>
                <TextField
                  placeholder="그리고"
                  value={mainScreen.andText}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateMain({ andText: e.target.value })
                  }
                />
              </FormControl>
              <FormControl asChild>
                <TextField
                  placeholder={
                    bride.lastName || bride.firstName
                      ? `${bride.lastName}${bride.firstName}`
                      : '신부'
                  }
                  value={mainScreen.brideName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateMain({ brideName: e.target.value })
                  }
                />
              </FormControl>
            </div>
          </FormField>
        </>
      ) : null}
    </div>
  );
}
