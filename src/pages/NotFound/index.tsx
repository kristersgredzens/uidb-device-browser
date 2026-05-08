import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <div className={styles.wrapper}>
      <h2>Page not found</h2>
      <Link to="/" className={styles.link}>
        Go Home
      </Link>
    </div>
  )
}

export default NotFound
