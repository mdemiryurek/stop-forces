import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
import styles from './ErrorState.module.scss';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps) => (
  <div className={styles['error-container']}>
    <div className={styles['error-content']}>
      <div className={styles['error-title']}>Error Loading Data</div>
      <p>{error}</p>
      <Button onClick={onRetry}>
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </Button>
    </div>
  </div>
);
