import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import styles from "./styles.module.css";

const Footer = () => {
  return (
    <Row className={styles.footer}>
      <Col>Left</Col>
      <Col className='text-center'>Middle</Col>
      <Col className='text-end'>Right</Col>
    </Row>
  );
};

export default Footer;
