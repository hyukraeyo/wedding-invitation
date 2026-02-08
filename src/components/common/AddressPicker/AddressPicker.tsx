'use client';

import React, { useState, useCallback } from 'react';
import { Search } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Address } from 'react-daum-postcode';
import { Dialog } from '@/components/ui/Dialog';
import { TextField } from '@/components/ui/TextField';
import { Button } from '@/components/ui/Button';
import styles from './AddressPicker.module.scss';

const DaumPostcodeEmbed = dynamic(
  () => import('react-daum-postcode').then((mod) => mod.DaumPostcodeEmbed),
  {
    ssr: false,
    loading: () => <div className={styles.loading}>주소 검색창을 불러오고 있습니다...</div>,
  }
);

interface AddressPickerProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (() => void) | undefined;
  open?: boolean | undefined;
  onOpenChange?: ((open: boolean) => void) | undefined;
  className?: string | undefined;
  label?: string | undefined;
  placeholder?: string | undefined;
  helperText?: string | undefined;
  variant?: React.ComponentProps<typeof TextField.Button>['variant'];
  radius?: React.ComponentProps<typeof TextField.Button>['radius'];
  disabled?: boolean | undefined;
  id?: string | undefined;
}

const AddressPickerRaw = (
  {
    value,
    onChange,
    onComplete,
    open: externalOpen,
    onOpenChange: setExternalOpen,
    className,
    label,
    placeholder = '주소 검색',
    helperText,
    variant = 'outline',
    radius = 'md',
    disabled,
    id,
    ...props
  }: AddressPickerProps,
  ref: React.Ref<HTMLButtonElement>
) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (setExternalOpen) {
        setExternalOpen(open);
      } else {
        setInternalOpen(open);
      }
    },
    [setExternalOpen]
  );

  const handleAddressComplete = (data: Address) => {
    let fullAddress = data.address;
    let extraAddress = '';

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname;
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
    }

    onChange(fullAddress);
    setIsOpen(false);
    onComplete?.();
  };

  const handleOpenModal = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  return (
    <>
      <TextField.Button
        ref={ref}
        id={id}
        variant={variant}
        radius={radius}
        label={label}
        placeholder={placeholder}
        helperText={helperText}
        value={value}
        onClick={handleOpenModal}
        className={className}
        rightSlot={<Search size={18} />}
        disabled={disabled}
        {...props}
      />
      <Dialog open={isOpen} onOpenChange={setIsOpen} mobileBottomSheet>
        <Dialog.Header title="주소 검색" />
        <Dialog.Body className={styles.body} padding={false}>
          {isOpen && (
            <div className={styles.embedWrapper}>
              <DaumPostcodeEmbed
                onComplete={handleAddressComplete}
                style={{ height: '100%' }}
                autoClose={false}
              />
            </div>
          )}
        </Dialog.Body>
        <Dialog.Footer className={styles.footer}>
          <Dialog.Close asChild>
            <Button variant="ghost">닫기</Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog>
    </>
  );
};

export const AddressPicker = React.forwardRef<HTMLButtonElement, AddressPickerProps>(
  AddressPickerRaw
);
AddressPicker.displayName = 'AddressPicker';
