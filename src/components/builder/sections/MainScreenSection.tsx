import React from 'react';
import { Home } from 'lucide-react';
import { useInvitationStore } from '@/store/useInvitationStore';
import { AccordionItem } from '../AccordionItem';
import { TextField } from '../TextField';
import { SegmentedControl } from '../SegmentedControl';
import { Switch } from '../Switch';
import { Field } from '../Field';
import { ImageUploader } from '../ImageUploader';
import styles from './MainScreenSection.module.scss';

interface SectionProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function MainScreenSection({ isOpen, onToggle }: SectionProps) {
    const {
        mainScreen, setMainScreen,
        imageUrl, setImageUrl,
        imageRatio, setImageRatio
    } = useInvitationStore();

    const updateMain = (data: Partial<typeof mainScreen>) => setMainScreen(data);

    return (
        <AccordionItem
            title="메인 화면"
            icon={Home}
            isOpen={isOpen}
            onToggle={onToggle}
            isCompleted={!!imageUrl}
        >
            <div className={styles.container}>
                {/* Main Photo */}
                <Field label="메인 사진">
                    <div className={styles.optionWrapper}>
                        <ImageUploader
                            value={imageUrl}
                            onChange={setImageUrl}
                            placeholder="메인 이미지 추가"
                            ratio={imageRatio}
                            onRatioChange={setImageRatio}
                        />
                    </div>
                </Field>

                {/* Layout Style */}
                <Field label="레이아웃">
                    <SegmentedControl
                        value={mainScreen.layout}
                        options={[
                            { label: '기본', value: 'basic' },
                            { label: '풀화면', value: 'fill' },
                            { label: '아치형', value: 'arch' },
                            { label: '타원형', value: 'oval' },
                            { label: '프레임', value: 'frame' },
                        ]}
                        onChange={(val) => updateMain({ layout: val as 'basic' | 'fill' | 'arch' | 'oval' | 'frame' })}
                    />
                </Field>

                {/* Photo Effects */}
                <Field label="사진 효과">
                    <SegmentedControl
                        value={mainScreen.effect}
                        options={[
                            { label: '없음', value: 'none' },
                            { label: '안개', value: 'mist' },
                            { label: '물결', value: 'ripple' },
                            { label: '종이', value: 'paper' },
                        ]}
                        onChange={(val) => updateMain({ effect: val as 'none' | 'mist' | 'ripple' | 'paper' })}
                    />
                </Field>

                {/* Title & Subtitle */}
                <Field label="상단 텍스트">
                    <div className={styles.optionWrapper}>
                        <TextField
                            label="제목"
                            type="text"
                            placeholder="예: THE MARRIAGE"
                            value={mainScreen.title}
                            onChange={(e) => updateMain({ title: e.target.value })}
                        />
                        <TextField
                            label="소제목"
                            type="text"
                            placeholder="예: 2024.10.12 SAT PM 12:00"
                            value={mainScreen.subtitle}
                            onChange={(e) => updateMain({ subtitle: e.target.value })}
                        />
                    </div>
                </Field>

                {/* Date & Place Info */}
                <Field label="일시 및 장소">
                    <TextField
                        type="text"
                        placeholder="미입력 시 예식일시 및 장소가 자동 노출됩니다"
                        value={mainScreen.customDatePlace}
                        onChange={(e) => updateMain({ customDatePlace: e.target.value })}
                    />
                </Field>

                {/* Connective Text */}
                <Field label="연결 문구">
                    <div className={styles.andTextWrapper}>
                        <div className={styles.andTextItem}>
                            <span className={styles.andTextLabel}>중간 글자</span>
                            <TextField
                                type="text"
                                placeholder="& or ·"
                                value={mainScreen.andText}
                                onChange={(e) => updateMain({ andText: e.target.value })}
                            />
                        </div>
                        <div className={styles.andTextItem}>
                            <span className={styles.andTextLabel}>뒤쪽 접미사</span>
                            <TextField
                                type="text"
                                placeholder="예: 의 결혼"
                                value={mainScreen.suffixText}
                                onChange={(e) => updateMain({ suffixText: e.target.value })}
                            />
                        </div>
                    </div>
                </Field>

                {/* Visibility Toggles */}
                <Field label="노출 설정">
                    <div className={styles.switchGroup}>
                        <Switch
                            checked={mainScreen.showTitle}
                            onChange={(show) => updateMain({ showTitle: show })}
                            label="제목 노출"
                        />
                        <Switch
                            checked={mainScreen.showSubtitle}
                            onChange={(show) => updateMain({ showSubtitle: show })}
                            label="소제목 노출"
                        />
                        <Switch
                            checked={mainScreen.showGroomBride}
                            onChange={(show) => updateMain({ showGroomBride: show })}
                            label="이름 노출"
                        />
                        <Switch
                            checked={mainScreen.showDatePlace}
                            onChange={(show) => updateMain({ showDatePlace: show })}
                            label="일시/장소"
                        />
                        <Switch
                            checked={mainScreen.showBorder}
                            onChange={(show) => updateMain({ showBorder: show })}
                            label="테두리 노출"
                        />
                        <Switch
                            checked={mainScreen.expandPhoto}
                            onChange={(show) => updateMain({ expandPhoto: show })}
                            label="사진 꽉 차게"
                        />
                    </div>
                </Field>
            </div>
        </AccordionItem>
    );
}
