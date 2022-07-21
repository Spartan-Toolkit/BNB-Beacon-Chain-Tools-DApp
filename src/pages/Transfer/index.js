import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { useBbc } from "../../Web3BNB";
import { BnbClientContext } from "../../Web3BNB/providers/BnbClientProvider";

const Transfer = () => {
  const client = useContext(BnbClientContext);
  const { address } = useBbc();

  const [receivers, setreceivers] = useState([]);

  const newTransfer = async () => {
    console.log(client);
    const txn = await client.transfer(
      address, // Address From (String)
      address, // Address To (String)
      0.000001, // Amount (Float)
      "BNB", // Asset Symbol (String) ie. "BNB"
      "Test Tsf" // Txn Memo (String)
    );
    console.log(txn);
  };

  const newBatchTransfer = async () => {
    console.log(client);
    try {
      const txn = await client.multiSend(
        address, // Address From (String)
        receivers, // Outputs (Transfer[{to, coins[denom, amount]},{to, coins[denom, amount]},...])
        "Test Tsf" // Txn Memo (String)
      );
      console.log("a txn", txn);
    } catch (err) {
      console.error("Transfer Error!", err);
    }
  };

  const elAddrTo = document.getElementById("formAddrTo");

  const elAsset = document.getElementById("formAsset");

  const elAmount = document.getElementById("formAmount");

  // const outputs = [
  //   {
  //     to: "tbnb1p4kpnj5qz5spsaf0d2555h6ctngse0me5q57qe",
  //     coins: [
  //       { denom: "BNB", amount: 10 },
  //       { denom: "BTC", amount: 10 },
  //     ],
  //   },
  //   {
  //     to: "tbnb1scjj8chhhp7lngdeflltzex22yaf9ep59ls4gk",
  //     coins: [
  //       { denom: "BTC", amount: 10 },
  //       { denom: "BNB", amount: 10 },
  //     ],
  //   },
  // ];

  const addRow = (toAddr, toAsset, toAmount) => {
    const _array = receivers
    const index = _array.findIndex((x) => x.to === toAddr);
    if (index > -1) {
      setreceivers(
        _array[index].coins.push({ denom: toAsset, amount: toAmount })
      );
      console.log("add asset to existing row", receivers);
    } else {
      setreceivers(
        _array.push({
          to: toAddr,
          coins: [{ denom: toAsset, amount: toAmount }],
        })
      );
      console.log("new row", receivers);
    }
  };

  const deleteRow = () => {
    // Find address and remove it from array -> setstate
  };

  return (
    <>
      <h5>Transfer</h5>
      <Card className='mb-3'>
        <Card.Header>Single Transfer / Batch Transfer</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Address From</Form.Label>
              <Form.Control placeholder={address} disabled className='mb-3' />
              <Form.Label>Transaction Memo</Form.Label>
              <Form.Control
                placeholder='Memo (Optional)'
                id='formMemo'
                className='mb-3'
              />
              <Form.Label>Address To</Form.Label>
              <Form.Control
                placeholder='Receiving Address'
                id='formAddrTo'
                className='mb-3'
              />
              <Form.Label>Sending Asset Symbol</Form.Label>
              <Form.Control
                placeholder='Asset Symbol. ie: BNB'
                id='formAsset'
                className='mb-3'
              />
              <Form.Label>Sending Amount</Form.Label>
              <Form.Control
                placeholder='Amount/units to send'
                id='formAmount'
                className='mb-3'
              ></Form.Control>
              <Button
                onClick={() => {
                  console.log(elAddrTo);
                  addRow(elAddrTo.value, elAsset.value, elAmount.value);
                }}
              >
                Add an extra receiver
              </Button>
              <Button
                onClick={() => console.log("TODO: Add CSV upload feature")}
              >
                Upload CSV file
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer>
          <Button
            onClick={() => (receivers > 1 ? newBatchTransfer() : newTransfer())}
          >
            Test Transfer
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Transfer;
