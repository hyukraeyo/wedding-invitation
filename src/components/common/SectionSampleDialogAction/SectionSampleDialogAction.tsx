import * as React from 'react';
import { Sparkles } from 'lucide-react';

import { SampleList } from '@/components/common/SampleList';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import type { SamplePhraseItem } from '@/types/builder';

import styles from './SectionSampleDialogAction.module.scss';

interface SectionSampleDialogActionProps {
  items: SamplePhraseItem[];
  onSelect: (sample: SamplePhraseItem) => void;
  triggerLabel?: string;
  dialogTitle?: string;
}

export function SectionSampleDialogAction({
  items,
  onSelect,
  triggerLabel = '추천 문구',
  dialogTitle = '추천 문구',
}: SectionSampleDialogActionProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = React.useCallback(
    (sample: SamplePhraseItem) => {
      onSelect(sample);
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen} mobileBottomSheet>
      <Dialog.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="xs"
          onClick={(event: React.MouseEvent<HTMLButtonElement>) => event.stopPropagation()}
        >
          <Sparkles className={styles.icon} />
          {triggerLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header title={dialogTitle} />
        <Dialog.Body>
          <SampleList items={items} onSelect={handleSelect} />
        </Dialog.Body>
      </Dialog.Content>
    </Dialog>
  );
}
