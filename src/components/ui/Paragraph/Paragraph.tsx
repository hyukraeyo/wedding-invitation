'use client';

import * as React from 'react';
import { Text, TextProps } from '../Text';

export interface ParagraphProps extends TextProps { }

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
    (props, ref) => {
        // @ts-ignore - Text as="p" matches HTMLParagraphElement
        return <Text as="p" {...props} ref={ref} />;
    }
);

Paragraph.displayName = 'Paragraph';

export { Paragraph };
