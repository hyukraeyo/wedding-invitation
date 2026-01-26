"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { RadioGroupField } from "@/components/common/RadioGroupField";

export function RadioGroupDemo() {
    return (
        <div className={styles.showcaseStack}>
            <RadioGroupField
                label="Selection Group"
                description="Select your role for the event coordinator"
                defaultValue="guest"
                options={[
                    { label: "Guest (하객)", value: "guest", description: "Standard access to view invitation" },
                    { label: "Family (혼주)", value: "family", description: "Extended access to manage guest list" },
                ]}
            />
        </div>
    );
}
