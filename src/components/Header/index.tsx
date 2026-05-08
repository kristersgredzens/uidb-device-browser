import { Link } from 'react-router-dom'
import { UbiquitiLogo } from '@/components/Icons'
import styles from './Header.module.css'

const USER_NAME = 'Kristers'

function Header() {
  return (
    <header className={styles.topBar}>
      <div className={styles.left}>
        <Link to="/" className={styles.logo} aria-label="Home">
          <UbiquitiLogo />
        </Link>
        <span className={styles.title}>Devices</span>
      </div>
      <div className={styles.right}>
        <span className={styles.user}>{USER_NAME}</span>
      </div>
    </header>
  )
}

export default Header
