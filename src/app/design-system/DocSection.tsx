"use client";

import React from "react";
import styles from "./DesignSystem.module.scss";
import { cn } from "@/lib/utils";

interface PropItem {
    name: string;
    type: string;
    defaultValue?: string;
    description: string;
}

interface DocSectionProps {
    title?: string;
    usage?: string;
    props?: PropItem[];
}

export default function DocSection({ title = "Documentation", usage, props }: DocSectionProps) {
    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <h2>{title}</h2>
                <p>컴포넌트 사용법과 사용 가능한 옵션들을 확인하세요.</p>
            </div>

            <div className={styles.showcaseStack}>
                {usage && (
                    <div className={styles.verticalStackSmall}>
                        <span className={styles.labelUppercaseBlack}>Usage</span>
                        <pre className={styles.codeBlock}>
                            <code>{usage}</code>
                        </pre>
                    </div>
                )}

                {props && props.length > 0 && (
                    <div className={styles.verticalStackSmall}>
                        <span className={styles.labelUppercaseBlack}>Options (Props)</span>
                        <div className={styles.tableWrapper}>
                            <table className={styles.propsTable}>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Type</th>
                                        <th>Default</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {props.map((prop) => (
                                        <tr key={prop.name}>
                                            <td><code>{prop.name}</code></td>
                                            <td><code className={styles.codeType}>{prop.type}</code></td>
                                            <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : "-"}</td>
                                            <td>{prop.description}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
