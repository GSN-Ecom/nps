import styles from './Title.module.css';

export const Title = ({ text, ...props }) => {
  return (
    <h1 className={`${styles.heading} ${'printTitle'}`} {...props}>
      {text}
    </h1>
  );
};

export default Title;
