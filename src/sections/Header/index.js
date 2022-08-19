import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";

import styles from "./styles.module.css";
import { routes } from "../../routes";

import Wallet from "../../components/Wallet";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../../assets/icon/toolbox.svg";

const Header = () => {
  const [showMenu, setshowMenu] = useState(false);

  return (
    <Row className={styles.header}>
      <Col xs='auto'>
        <Logo height='30' width='30' />
        <h5 className='d-none d-sm-inline-block ms-2 align-middle mb-0'>
          BNBChain Toolkit
        </h5>
      </Col>
      <Col className='text-center d-none d-md-block'>
        {routes.map((route) => (
          <Link
            key={route.route}
            to={route.route}
            className='mx-1 align-middle'
          >
            {route.label}
          </Link>
        ))}
      </Col>
      <Col className='text-start d-block d-md-none'>
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
      <Col xs='auto' className='text-end'>
        <Wallet />
      </Col>
    </Row>
  );
};

export default Header;
