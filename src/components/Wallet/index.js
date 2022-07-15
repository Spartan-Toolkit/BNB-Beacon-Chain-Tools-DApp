import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  clearTheWallet,
  connectBinanceWallet,
  selectBinanceWallet,
  useBeacon,
} from "../../Web3BNB";
import { chainIds } from "../../Web3BNB/const";
import { formatShortString, getAddressesBW } from "../../Web3BNB/helpers";

const Wallet = () => {
  const dispatch = useDispatch();
  const beacon = useBeacon();

  const [showModal, setshowModal] = useState(false);
  const [network, setnetwork] = useState(null);
  const [addresses, setaddresses] = useState([]);
  const [address, setaddress] = useState(null);

  const handleClose = () => setshowModal(false);
  const handleShow = () => setshowModal(true);

  useEffect(() => {
    const getAddr = async () => {
      if (beacon.walletType === "BW") {
        const _addresses = await getAddressesBW();
        setaddresses(_addresses);
      }
    };
    getAddr();
    return () => {
      setaddresses([]);
      setaddress(null);
    };
  }, [beacon.walletType]);

  useEffect(() => {
    setaddresses([]);
    setaddress(null);
    dispatch(clearTheWallet());
  }, [dispatch, network]);

  return (
    <>
      <Button size='sm' variant='primary' onClick={handleShow}>
        {beacon.address ? formatShortString(beacon.address) : "Connect Wallet"}
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Connect Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Select Network:</h5>
          {chainIds.map((x) => (
            <Button
              key={x.id}
              variant={network === x.id ? "primary" : "secondary"}
              onClick={() => setnetwork(x.id)}
            >
              {x.name}
            </Button>
          ))}
          {!beacon.walletType && (
            <>
              <h5>Select Wallet Type:</h5>
              <Button
                variant='secondary'
                onClick={() => dispatch(connectBinanceWallet(network))}
                disabled={!network}
              >
                Connect to Binance Wallet
              </Button>
            </>
          )}
          {beacon.walletType === "BW" && (
            <>
              <h5>Select Binance Wallet Address:</h5>
              <Form>
                {addresses.map((x) => (
                  <Form.Check
                    key={x}
                    type='radio'
                    name='group1'
                    id={x}
                    label={x}
                    onClick={() => setaddress(x)}
                  />
                ))}
              </Form>
              <h5>Set Wallet Address:</h5>
              <Button
                onClick={() => dispatch(selectBinanceWallet(address))}
                disabled={!address}
              >
                Set Address
              </Button>
            </>
          )}
          <h5>Currently Selected Address:</h5>
          {beacon.address}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => {
              dispatch(clearTheWallet());
              setaddress(null);
              setnetwork(null);
            }}
          >
            {!beacon.walletType ? "Clear" : "Disconnect"} Wallet
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
