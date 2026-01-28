"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInvitationStore } from "@/store/useInvitationStore";
import { useShallow } from "zustand/react/shallow";
import { DynamicResponsiveModal as ResponsiveModal } from "@/components/common/ResponsiveModal/Dynamic";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { parseKoreanName } from "@/lib/utils";
import styles from "./InvitationOnboardingModal.module.scss";

interface InvitationOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function InvitationOnboardingModal({ isOpen, onClose }: InvitationOnboardingModalProps) {
    const router = useRouter();
    const {
        setGroom,
        setBride,
        setDate,
        setTime,
        setLocation,
    } = useInvitationStore(
        useShallow((state) => ({
            setGroom: state.setGroom,
            setBride: state.setBride,
            setDate: state.setDate,
            setTime: state.setTime,
            setLocation: state.setLocation,
        }))
    );

    const [formData, setFormData] = useState({
        groomName: "",
        brideName: "",
        date: "",
        time: "13:00",
        location: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            setGroom(parseKoreanName(formData.groomName));
            setBride(parseKoreanName(formData.brideName));

            if (formData.date) setDate(formData.date);
            if (formData.time) setTime(formData.time);
            if (formData.location) setLocation(formData.location);

            router.push("/builder?onboarding=true");
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="Invitation basics"
            description="Enter the essentials now. You can edit everything later."
            showCancel={true}
            cancelText="Cancel"
            confirmText="Start"
            onConfirm={handleSubmit}
            onCancel={onClose}
            confirmLoading={loading}
        >
            <div className={styles.container}>
                <div className={styles.section}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <Label htmlFor="groomName" className={styles.label}>Groom name</Label>
                            <Input
                                id="groomName"
                                name="groomName"
                                placeholder="John Kim"
                                value={formData.groomName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.field}>
                            <Label htmlFor="brideName" className={styles.label}>Bride name</Label>
                            <Input
                                id="brideName"
                                name="brideName"
                                placeholder="Emily Park"
                                value={formData.brideName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <Label htmlFor="date" className={styles.label}>Wedding date</Label>
                            <div className={styles.inputGroup}>
                                <Input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className={styles.field}>
                            <Label htmlFor="time" className={styles.label}>Wedding time</Label>
                            <div className={styles.inputGroup}>
                                <Input
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.section}>
                    <div className={styles.field}>
                        <Label htmlFor="location" className={styles.label}>Venue</Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="Banana Wedding Hall"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </ResponsiveModal>
    );
}

export default InvitationOnboardingModal;
