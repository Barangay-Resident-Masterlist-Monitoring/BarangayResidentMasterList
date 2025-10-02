import styles from '../css/footer.module.css'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <img
          src="/images/logo.png" 
          alt="Logo"
          className={styles.logo}
        />
      </div>
      <div className={styles.text}>
        © {new Date().getFullYear()} Municipality of San Juan, Province of Batangas, Brgy. Mabalanoy. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
