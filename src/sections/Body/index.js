import { Routes, Route } from "react-router-dom";
import Container from "react-bootstrap/Container";

import { routes } from "../../routes.js";

import styles from "./styles.module.css";

const Body = () => {
  return (
    <Container className={styles.wrapper}>
      <Routes>
        {routes.map((route) => (
          <Route key={route.route} path={route.route} element={route.component} />
        ))}
      </Routes>
    </Container>
  );
};

export default Body;
