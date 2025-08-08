import { SelectHTMLAttributes, forwardRef } from 'react';
import styles from './Select.module.scss';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, id, ...props }, ref) => {
    const getSelectClasses = () => {
      const classes = [styles['select-field']];
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    };

    return (
      <div className={styles['select-container']}>
        {label && (
          <label htmlFor={id} className={styles['select-label']}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={getSelectClasses()}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select; 