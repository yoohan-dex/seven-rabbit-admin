import React from 'react';
import styles from './share.less';

export const BackgroundImage = ({ url }) => (
  <div className={styles.backgroundImage} style={{ backgroundImage: `url(${url})` }} />
);
