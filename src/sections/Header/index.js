import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import styles from "./styles.module.css";
import { routes } from "../../routes";

import Wallet from "../../components/Wallet";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <Row className={styles.header}>
      <Col>
        *LOGO* Beacon Tools <small>by Spartan Toolkit</small>
      </Col>
      <Col className='text-center'>
        {routes.map((route) => (
          <Link key={route.route} to={route.route} className='mx-1'>
            {route.label}
          </Link>
        ))}
      </Col>
      <Col className='text-end'>
        <Wallet />
      </Col>
    </Row>
  );
};

export default Header;
