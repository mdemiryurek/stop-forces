import { ReactNode } from 'react';
import styles from './ChartContainer.module.scss';

export interface ChartContainerProps {
  title: string;
  children: ReactNode;
  className?: string;
  description?: string;
}

const ChartContainer = ({ title, children, className, description }: ChartContainerProps) => {
  const getContainerClasses = () => {
    const classes = [styles['chart-container']];
    if (className) {
      classes.push(className);
    }
    return classes.join(' ');
  };

  return (
    <div className={getContainerClasses()}>
      <div className={styles['chart-header']}>
        <h3>{title}</h3>
        {description && (
          <p>{description}</p>
        )}
      </div>
      <div className={styles['chart-content']}>
        {children}
      </div>
    </div>
  );
};

ChartContainer.displayName = 'ChartContainer';
export default ChartContainer; 