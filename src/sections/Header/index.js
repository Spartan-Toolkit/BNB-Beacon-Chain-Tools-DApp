import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";

import styles from "./styles.module.css";
import { routes } from "../../routes";

import Wallet from "../../components/Wallet";
import { Link } from "react-router-dom";

const Header = () => {
  const [showMenu, setshowMenu] = useState(false);

  return (
    <Row className={styles.header}>
      <Col>
        <div>*LOGO*</div>
        <div className='d-none d-sm-block'>
          Beacon Tools <small>by Spartan Toolkit</small>
        </div>
      </Col>
      <Col className='text-center d-none d-md-block'>
        {routes.map((route) => (
          <Link key={route.route} to={route.route} className='mx-1'>
            {route.label}
          </Link>
        ))}
      </Col>
      <Col className='text-center d-block d-md-none'>
        <Button size='sm' onClick={() => setshowMenu(true)}>
          MENU
        </Button>
        <Offcanvas show={showMenu} onHide={() => setshowMenu(false)}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Nav Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {routes.map((route) => (
              <Link
                key={route.route}
                to={route.route}
                className='mx-1'
                onClick={() => setshowMenu(false)}
              >
                {route.label}
              </Link>
            ))}
          </Offcanvas.Body>
        </Offcanvas>
      </Col>
      <Col className='text-end'>
        <Wallet />
      </Col>
    </Row>
  );
};

export default Header;
