'use client';

import styles from './Header.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles['header-container']}>
        <div className={styles.logo}>
          <h1 className={styles['logo-text']}>
            Metropolitan Police Stop & Search Data
          </h1>
          <p className={styles['logo-description']}>
            Analysis of stop and search operations over time
          </p>
        </div>
      </div>
    </header>
  );
};

Header.displayName = 'Header';

export default Header; 