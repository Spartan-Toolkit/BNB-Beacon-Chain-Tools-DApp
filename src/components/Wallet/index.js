import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  bbcUpdateChainId,
  bbcUpdateWalletType,
  bbcUpdateAddress,
  bbcClearWallet,
  useBbc,
} from "../../Web3BNB";
import { networks } from "../../Web3BNB/utils/network";
import { formatShortString } from "../../Web3BNB/utils/helpers";

const Wallet = () => {
  const dispatch = useDispatch();
  const { chainId, walletType, addrArray, address } = useBbc();

  const [showModal, setshowModal] = useState(false);
  const [addrState, setaddrState] = useState(address ?? false);
  const [wrongAddr, setwrongAddr] = useState(false);

  const handleClose = () => setshowModal(false);
  const handleShow = () => setshowModal(true);

  useEffect(() => {
    setaddrState(false);
    dispatch(bbcClearWallet());
  }, [dispatch, chainId]);

  useEffect(() => {
    const checkAddrBW = async () => {
      const addrBW = await window.BinanceChain.request({
        method: "eth_requestAccounts",
      });
      if (addrBW[0] !== addrState) {
        // if false {alert user to open BW and change their selected account to match}
        setwrongAddr(true);
      } else {
        setwrongAddr(false);
      }
    };
    if (addrState && walletType === "BW") {
      checkAddrBW();
    } else {
      setwrongAddr(false);
    }
  }, [addrState, walletType, showModal]);

  return (
    <>
      <Button size='sm' variant='primary' onClick={handleShow}>
        {address ? formatShortString(address) : "Connect Wallet"}
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Select Network:</h5>
          {networks.map((x) => (
            <Button
              key={x.id}
              variant={chainId === x.id ? "primary" : "secondary"}
              onClick={() => dispatch(bbcUpdateChainId(x.id))}
            >
              {x.name}
            </Button>
          ))}
          {!walletType && (
            <>
              <h5>Select Wallet Type:</h5>
              <Button
                variant='secondary'
                onClick={() => dispatch(bbcUpdateWalletType("BW"))}
                disabled={!chainId}
              >
                Connect to Binance Wallet
              </Button>
            </>
          )}
          {walletType === "BW" && (
            <>
              <h5>Select Binance Wallet Address:</h5>
              <Form>
                {addrArray.map((x) => (
                  <Form.Check
                    key={x}
                    type='radio'
                    name='group1'
                    id={x}
                    label={x}
                    onClick={() => setaddrState(x)}
                    // TODO: ADD CONDITIONAL INITIAL/ON-LOAD VALUE BASED ON REDUX STATE
                  />
                ))}
              </Form>
              <h5>Set Wallet Address:</h5>
              <Button
                onClick={() => dispatch(bbcUpdateAddress(addrState))}
                disabled={!addrState || wrongAddr}
              >
                Set Address
              </Button>
              {wrongAddr && (
                <Alert variant='warning'>
                  Please open BinanceWallet extension and change your selected
                  account/address first
                </Alert>
              )}
            </>
          )}
          <h5>Currently Selected Address:</h5>
          {address}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              dispatch(bbcClearWallet());
              setaddrState(null);
            }}
          >
            {!walletType ? "Clear" : "Disconnect"} Wallet
          </Button>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Wallet;
