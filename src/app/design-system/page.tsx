import DesignSystemClient from "./DesignSystemClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Design System | Banana Wedding",
    description: "Visual gallery of UI components used in the Banana Wedding project.",
};

export default function DesignSystemPage() {
    return <DesignSystemClient />;
}
