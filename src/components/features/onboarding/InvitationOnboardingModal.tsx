"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useInvitationStore } from "@/store/useInvitationStore";
import { useShallow } from "zustand/react/shallow";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { TextField } from "@/components/ui/TextField";
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
        time: "",
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
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>

            <Dialog.Header>
                <div className={styles.header}>
                    <Text typography="t4" fontWeight="bold">Invitation basics</Text>
                    <Text typography="t6" color="#666">Enter the essentials now. You can edit everything later.</Text>
                </div>
            </Dialog.Header>
            <Dialog.Body>
                <div className={styles.container}>
                    <div className={styles.section}>
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <TextField

                                    label="Groom name"
                                    id="groomName"
                                    name="groomName"
                                    placeholder="John Kim"
                                    value={formData.groomName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <TextField

                                    label="Bride name"
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
                                <TextField

                                    label="Wedding date"
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.field}>
                                <TextField

                                    label="Wedding time"
                                    id="time"
                                    name="time"
                                    type="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <div className={styles.field}>
                            <TextField

                                label="Venue"
                                id="location"
                                name="location"
                                placeholder="Banana Wedding Hall"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>
            </Dialog.Body>
            <Dialog.Footer className={styles.footer}>
                <Button className={styles.button} variant="weak" size="lg" onClick={onClose}>
                    Cancel
                </Button>
                <Button className={styles.button} variant="fill" size="lg" loading={loading} onClick={handleSubmit}>
                    Start
                </Button>

            </Dialog.Footer>
        </Dialog>
    );
}

export default InvitationOnboardingModal;
