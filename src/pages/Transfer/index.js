import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
// import { multiSendBW } from "../../Web3BNB";

const Transfer = () => {
  const dispatch = useDispatch();

  return (
    <>
      <h5>Transfer</h5>
      <div>Body text</div>
      {/* <Button onClick={() => dispatch(multiSendBW())}>Test MultiSend</Button> */}
    </>
  );
};

export default Transfer;
