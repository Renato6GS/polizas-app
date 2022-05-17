import React from 'react';

import styles from './styles.module.css';

export default function FieldReport({ label, description }) {
  return (
    <div className={styles.fieldContainer}>
      <p className='label'>{label}</p>
      <p className='description'>{description}</p>
    </div>
  );
}
