import { clsx } from 'clsx';
import commonStyles from './Builder.module.scss'; // Assuming it uses common styles or create Label.module.scss if needed. Checking file it might not have its own scss.

interface LabelProps extends React.HTMLAttributes<HTMLLabelElement> {
    required?: boolean;
}

export const Label = ({ children, className, required, ...props }: LabelProps) => {
    return (
        <label className={clsx(commonStyles.label, className)} {...props}>
            {children}
            {required && <span className={commonStyles.required}>*</span>}
        </label>
    );
};
