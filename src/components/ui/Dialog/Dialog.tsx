"use client"

import * as React from 'react'
import { Modal } from '@toss/tds-mobile'

/**
 * 🍌 Dialog 컴포넌트 (TDS Mobile Modal 기반)
 * - TDS Mobile 2.x에서는 일반 Dialog 대신 Modal을 사용합니다.
 * - Radix UI 기반의 기존 API와 호환성을 위해 래퍼를 제공합니다.
 */
const Dialog = Modal as any

const DialogContent = ({ children, className, ...props }: any) => (
    <Modal.Content className={className} {...props}>
        {children}
    </Modal.Content>
)

const DialogOverlay = Modal.Overlay as any

// TDS Modal does not have these as direct subcomponents, so we provide no-ops or simple wrappers
const DialogPortal = ({ children }: any) => <>{children}</>
const DialogTrigger = ({ children }: any) => <>{children}</>
const DialogClose = ({ children }: any) => <>{children}</>

const DialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={className} {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={className} {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = ({ children, className, ...props }: any) => (
    <h2 className={className} {...props}>{children}</h2>
)

const DialogDescription = ({ children, className, ...props }: any) => (
    <p className={className} {...props}>{children}</p>
)

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
