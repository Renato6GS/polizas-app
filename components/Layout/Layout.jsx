import styles from './styles.module.css';

export default function Layout({ children }) {
  return (
    <>
      {/* <Header /> */}
      <main className={styles.main}>{children}</main>
      {/* <Footer /> */}
    </>
  );
}
