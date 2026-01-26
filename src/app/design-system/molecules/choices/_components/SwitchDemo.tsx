"use client";

import React, { useState } from "react";
import styles from "../../../DesignSystem.module.scss";
import { SwitchField } from "@/components/common/SwitchField";

export function SwitchDemo() {
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(false);

    return (
        <div className={styles.showcaseStack}>
            <SwitchField
                label="Notifications"
                description="Receive alerts when new RSVP comes in"
                checked={isNotificationsEnabled}
                onChange={setIsNotificationsEnabled}
            />
        </div>
    );
}
