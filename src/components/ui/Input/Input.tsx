import { InputHTMLAttributes, forwardRef, useId } from 'react';
import styles from './Input.module.scss';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const getInputClasses = () => {
      const classes = [styles['input-field']];
      if (error) {
        classes.push(styles.error);
      }
      if (className) {
        classes.push(className);
      }
      return classes.join(' ');
    };

        return (
      <div className={styles['input-container']}>
        {label && (
          <label htmlFor={inputId} className={styles['input-label']}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={getInputClasses()}
          {...props}
        />
        {error && (
          <p className={styles['input-error']} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 