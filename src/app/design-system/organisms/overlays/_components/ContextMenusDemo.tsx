"use client";

import React from "react";
import styles from "../../../DesignSystem.module.scss";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/DropdownMenu";
import { Edit2, MoreVertical, Share2, Trash2 } from "lucide-react";

export function ContextMenusDemo() {
    return (
        <div className={styles.showcaseRow}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical size={20} />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className={styles.widthFull} style={{ minWidth: 200 }}>
                    <DropdownMenuLabel>Invitation Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Edit2 size={14} style={{ marginRight: 8 }} /> Edit Details</DropdownMenuItem>
                    <DropdownMenuItem><Share2 size={14} style={{ marginRight: 8 }} /> Copy Link</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600"><Trash2 size={14} style={{ marginRight: 8 }} /> Delete Forever</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
