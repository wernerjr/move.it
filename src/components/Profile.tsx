import styles from '../styles/components/Profile.module.css';

export function Profile(){
  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/wernerjr.png" alt="Werner Junior"/>
      <div>
        <strong>Werner Junior</strong>
        <p>
          <img src="icons/level.svg" alt="Level"/>
          Level 1
        </p>
      </div>
    </div>
  )
}