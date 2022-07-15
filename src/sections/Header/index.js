import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import styles from "./styles.module.css";
import { routes } from "../../routes";

import Wallet from "../../components/Wallet";

const Header = () => {
  return (
    <Row className={styles.header}>
      <Col>
        *LOGO* Beacon Tools <small>by Spartan Toolkit</small>
      </Col>
      <Col className='text-center' onClick={console.log('')}>
        {routes.map((route) => route.label + " ")}
      </Col>
      <Col className='text-end'>
        <Wallet />
      </Col>
    </Row>
  );
};

export default Header;
