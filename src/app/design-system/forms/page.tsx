"use client";

import styles from "../DesignSystem.module.scss";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Checkbox } from "@/components/ui/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/RadioGroup";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";

export default function FormsPage() {
    return (
        <>
            <header className={styles.pageHeader}>
                <h1>Forms & Inputs</h1>
                <p>데이터 입력을 위한 폼 컴포넌트입니다.</p>
            </header>

            {/* Text Input */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Text Input</h2>
                    <p>텍스트 입력 필드</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.formGrid}>
                        <div className={styles.formItem}>
                            <Label htmlFor="demo-name">이름</Label>
                            <Input id="demo-name" placeholder="이름을 입력하세요" />
                        </div>
                        <div className={styles.formItem}>
                            <Label htmlFor="demo-email">이메일</Label>
                            <Input id="demo-email" type="email" placeholder="you@example.com" />
                        </div>
                        <div className={styles.formItem}>
                            <Label htmlFor="demo-error">에러 상태</Label>
                            <Input id="demo-error" error placeholder="필수 입력 항목" />
                            <span className={styles.errorText}>이 필드는 필수입니다.</span>
                        </div>
                        <div className={styles.formItem}>
                            <Label htmlFor="demo-disabled">비활성화</Label>
                            <Input id="demo-disabled" disabled placeholder="비활성화됨" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Textarea */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Textarea</h2>
                    <p>여러 줄 텍스트 입력</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.formItem}>
                        <Label htmlFor="demo-message">메시지</Label>
                        <Textarea id="demo-message" placeholder="메시지를 입력하세요..." />
                    </div>
                </div>
            </section>

            {/* Select */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Select</h2>
                    <p>드롭다운 선택</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.formItem}>
                        <Label>테마 선택</Label>
                        <Select>
                            <SelectTrigger style={{ width: 240 }}>
                                <SelectValue placeholder="테마를 선택하세요" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="classic">클래식</SelectItem>
                                <SelectItem value="modern">모던</SelectItem>
                                <SelectItem value="romantic">로맨틱</SelectItem>
                                <SelectItem value="minimal">미니멀</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </section>


            {/* Switch & Checkbox */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Switch & Checkbox</h2>
                    <p>토글 및 체크박스</p>
                </div>
                <div className={styles.card}>
                    <div className={styles.toggleGrid}>
                        <div className={styles.toggleItem}>
                            <Switch id="demo-switch" />
                            <Label htmlFor="demo-switch">알림 받기</Label>
                        </div>
                        <div className={styles.toggleItem}>
                            <Checkbox id="demo-check1" />
                            <Label htmlFor="demo-check1">이용약관에 동의합니다</Label>
                        </div>
                        <div className={styles.toggleItem}>
                            <Checkbox id="demo-check2" />
                            <Label htmlFor="demo-check2">마케팅 정보 수신 동의</Label>
                        </div>
                    </div>
                </div>
            </section>

            {/* Radio Group */}
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <h2>Radio Group</h2>
                    <p>단일 선택 라디오 버튼</p>
                </div>
                <div className={styles.card}>
                    <RadioGroup defaultValue="option1">
                        <div className={styles.radioItem}>
                            <RadioGroupItem value="option1" id="r1" />
                            <Label htmlFor="r1">옵션 1</Label>
                        </div>
                        <div className={styles.radioItem}>
                            <RadioGroupItem value="option2" id="r2" />
                            <Label htmlFor="r2">옵션 2</Label>
                        </div>
                        <div className={styles.radioItem}>
                            <RadioGroupItem value="option3" id="r3" />
                            <Label htmlFor="r3">옵션 3</Label>
                        </div>
                    </RadioGroup>
                </div>
            </section>
        </>
    );
}
