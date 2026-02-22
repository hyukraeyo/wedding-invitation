import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-undef': 'off',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@/components/ui/BottomCTA',
              message:
                "BottomCTA는 조합형 컴포넌트입니다. '@/components/common/BottomCTA'를 사용하세요.",
            },
            {
              name: '@/components/ui/CTAButton',
              message:
                "CTAButton은 조합형 컴포넌트입니다. '@/components/common/CTAButton'를 사용하세요.",
            },
            {
              name: '@/components/ui/EmptyState',
              message:
                "EmptyState는 조합형 컴포넌트입니다. '@/components/common/EmptyState'를 사용하세요.",
            },
            {
              name: '@/components/ui/SwitchRow',
              message:
                "SwitchRow는 조합형 컴포넌트입니다. '@/components/common/SwitchRow'를 사용하세요.",
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/**/*.tsx'],
    ignores: ['src/app/(with-header)/design/page.tsx'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "JSXOpeningElement[name.type='JSXIdentifier'][name.name=/^(Button|Heading|TextField|IconButton|EmptyState|AlertDialogDescription)$/] > JSXAttribute[name.name='className']",
          message:
            '페이지에서 UI 컴포넌트 className 오버라이드는 금지됩니다. UI 컴포넌트의 variant/size/option props 또는 래퍼 컴포넌트를 사용하세요.',
        },
        {
          selector:
            "JSXOpeningElement[name.type='JSXMemberExpression'][name.object.name='Dialog'] > JSXAttribute[name.name='className']",
          message:
            '페이지에서 Dialog 하위 컴포넌트 className 오버라이드는 금지됩니다. Dialog 전용 옵션 props를 사용하세요.',
        },
      ],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'scripts/**',
    'public/sw.js',
    'public/workbox-*.js',
  ]),
  prettierConfig,
]);

export default eslintConfig;
