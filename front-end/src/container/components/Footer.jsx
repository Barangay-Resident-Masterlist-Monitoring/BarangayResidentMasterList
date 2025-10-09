import styles from '../css/footer.module.css'
import mabalanoyLogo from '../images/mabalanoy.png';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.logoContainer}>
        <img
          src={mabalanoyLogo} 
          alt="Logo"
          className={styles.logo}
          width={50}  
        />
      </div>
      <div className={styles.text}>
        © {new Date().getFullYear()} Municipality of San Juan, Province of Batangas, Brgy. Mabalanoy. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
