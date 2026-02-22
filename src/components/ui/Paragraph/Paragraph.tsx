'use client';

import * as React from 'react';
import { Text, TextProps } from '../Text';

export type ParagraphProps = TextProps;

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>((props, ref) => {
  return <Text as="p" {...props} ref={ref} />;
});

Paragraph.displayName = 'Paragraph';

export { Paragraph };
