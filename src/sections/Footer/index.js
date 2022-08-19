import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import styles from "./styles.module.css";
import { ReactComponent as GithubIcon } from "../../assets/icon/github.svg";
import { ReactComponent as HeartIcon } from "../../assets/icon/heart.svg";
import { ReactComponent as SpartaIcon } from "../../assets/icon/spartav2.svg";
import { ReactComponent as TelegramIcon } from "../../assets/icon/telegram.svg";

const Footer = () => {
  return (
    <Row className={styles.footer}>
      <Col xs='auto'>
        <a
          href='https://github.com/Spartan-Toolkit'
          target='_blank'
          rel='noreferrer'
        >
          <GithubIcon height='23' width='23' />
        </a>
      </Col>
      <Col className='text-center d-none d-md-block'>
        <span className='align-middle'>Made with </span>
        <HeartIcon height='23' width='23' />
        <span className='align-middle'> by the Spartan Protocol Community</span>
      </Col>
      <Col className='text-center d-block d-md-none'>
        <span className='align-middle'>Built by </span>
        <SpartaIcon height='21' width='21' />
        <span className='align-middle'> with </span>
        <HeartIcon height='23' width='23' />
      </Col>
      <Col xs='auto' className='text-end'>
        <a
          href='https://t.me/SpartanProtocolOrg'
          target='_blank'
          rel='noreferrer'
        >
          <TelegramIcon height='23' width='23' />
        </a>
      </Col>
    </Row>
  );
};

export default Footer;
