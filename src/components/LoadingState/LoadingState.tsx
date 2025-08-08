import styles from './LoadingState.module.scss';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({ message = "Please wait while we load the data..." }: LoadingStateProps) => (
  <div className={styles['loading-container']}>
    <div className={styles['loading-content']}>
      <div className={styles['loading-spinner']}></div>
      <p>{message}</p>
    </div>
  </div>
);
