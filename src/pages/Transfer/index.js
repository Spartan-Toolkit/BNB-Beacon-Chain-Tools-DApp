import { useContext, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import { useBbc } from "../../Web3BNB";
import { BnbClientContext } from "../../Web3BNB/providers/BnbClientProvider";
import { getNetwork } from "../../Web3BNB/utils/network";

const Transfer = () => {
  const client = useContext(BnbClientContext);
  const { address, balances, chainId } = useBbc();

  const [refresh, setrefresh] = useState(0);
  const [receivers, setreceivers] = useState([]);
  const [prefix, setprefix] = useState(null);
  const [addrValid, setaddrValid] = useState(true);
  const [unitsValid, setunitsValid] = useState(true);

  useEffect(() => {
    setprefix(getNetwork(chainId).prefix);
    setreceivers([]);
    setaddrValid(false);
  }, [chainId]);

  const newTransfer = async () => {
    console.log(client);
    const txn = await client.transfer(
      address, // Address From (String)
      elAddrTo.value, // Address To (String)
      elAmount.value, // Amount (Float)
      elAsset.value, // Asset Symbol (String) ie. "BNB"
      elMemo.value // Txn Memo (String)
    );
    console.log(txn);
  };

  const newBatchTransfer = async () => {
    console.log(client);
    console.log(receivers);
    const _receivers = [];
    for (let i = 0; i < receivers.length; i += 1) {
      _receivers.push(receivers[i]);
    }
    try {
      const txn = await client.multiSend(
        address, // Address From (String)
        _receivers, // Outputs (Transfer[{to, coins[denom, amount]},{to, coins[denom, amount]},...])
        elMemo.value // Txn Memo (String)
      );
      console.log("a txn", txn);
    } catch (err) {
      console.error("Transfer Error!", err);
    }
    setreceivers([]); // Have to clear form on error due to bug that exponentially increases units (might be bnc, might be BW, might be dapp)
    setaddrValid(false); // To recreate, just do a valid multisend txn but reject the txn instaed of approving and the next time to open the same txn the values will be higher
  };

  const elAddrTo = document.getElementById("formAddrTo");
  const elMemo = document.getElementById("formMemo");
  const elAsset = document.getElementById("formAsset");
  const elAmount = document.getElementById("formAmount");
  const elCsvFile = document.getElementById("csvFile");

  const handleAddrInput = (value) => {
    const isValid = client.checkAddress(value, prefix);
    setaddrValid(isValid);
    return isValid;
  };

  const handleUnitsInput = (value) => {
    const balance = balances.filter((x) => x.symbol === elAsset.value)[0].free;
    if (value > 0 && value <= balance) {
      setunitsValid(true);
    } else {
      setunitsValid(false);
    }
  };

  const handleUploadCSV = (csvFile) => {
    if (csvFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        console.log(text);
        const rows = text.split(/\r\n|\n|\r/);
        console.log(rows);
        for (let i = 0; i < rows.length; i += 1) {
          const entries = rows[i].split(",");
          console.log(entries);
          if (entries.length === 3) {
            if (!handleAddrInput(entries[0])) {
              console.log("Invalid address in row " + i, entries[0]); // validate address
            } else if (balances) {
              const balance = balances.filter((x) => x.symbol === entries[1]);
              if (!balance || balance.length <= 0) {
                console.log("Invalid asset in row " + i, entries[1]); // validate asset
                // TODO: validate amount
              } else {
                addRow(entries[0], entries[1], entries[2]);
              }
            } else {
              console.log("No wallet connected?");
            }
          } else {
            console.log("Invalid row " + i, entries);
          }
        }
      };
      reader.readAsText(csvFile);
    }
    elCsvFile.value = null;
  };

  const addRow = (toAddr, toAsset, toAmount) => {
    if (client.checkAddress(toAddr, prefix)) {
      const _array = receivers;
      console.log(_array);
      const recIndex = _array.findIndex((x) => x.to === toAddr);
      if (recIndex > -1) {
        const denomIndex = _array[recIndex].coins.findIndex(
          (x) => x.denom === toAsset
        );
        if (denomIndex > -1) {
          console.log(
            "TODO: Handle existing asset + receiver combo",
            receivers
          );
        } else {
          _array[recIndex].coins.push({
            denom: toAsset,
            amount: toAmount,
          });
          setreceivers(_array);
          console.log("add extra asset to existing receiver", receivers);
        }
      } else {
        _array.push({
          to: toAddr,
          coins: [{ denom: toAsset, amount: toAmount }],
        });
        setreceivers(_array);
        console.log("new receiver", receivers);
      }
      setrefresh((prev) => prev + 1);
    }
  };

  const deleteRow = (receiverIndex, denomIndex) => {
    // Find address and remove it from array -> setstate
    const _array = receivers;
    _array[receiverIndex].coins.splice(denomIndex, 1);
    if (_array[receiverIndex].coins.length <= 0) {
      _array.splice(receiverIndex, 1);
    }
    setreceivers(_array);
    console.log("removed a transfer", receivers);
    setrefresh((prev) => prev + 1);
  };

  return (
    <>
      <h5>Transfer</h5>
      <Card className='mb-3'>
        <Card.Header onClick={() => console.log(window.BinanceChain)}>
          Single Transfer / Batch Transfer
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className='mb-3'>
              <Form.Label>Address From</Form.Label>
              <Form.Control
                placeholder={address ?? "Connect wallet first"}
                disabled
                className='mb-3'
              />
              <Form.Label>Transaction Memo</Form.Label>
              <Form.Control
                placeholder='Memo (Optional)'
                id='formMemo'
                className='mb-3'
              />
              <Form.Label>Address To</Form.Label>
              <Form.Control
                placeholder={"Receiving Address (" + prefix + "...)"}
                id='formAddrTo'
                className='mb-3'
                onChange={(e) => handleAddrInput(e.target.value)}
              />
              {!addrValid && (
                <Alert variant='danger'>
                  Invalid address entered, make sure it is a valid address
                  starting with "{prefix}"
                </Alert>
              )}
              <Form.Label>Sending Asset</Form.Label>
              <Form.Select id='formAsset'>
                <option>
                  {balances?.length > 0
                    ? "Select asset to send"
                    : "Selected wallet is empty"}
                </option>
                {balances?.length > 0 &&
                  balances.map((x) => (
                    <option key={x.symbol} value={x.symbol}>
                      {x.symbol + " (Balance: " + x.free + ")"}
                    </option>
                  ))}
              </Form.Select>
              <Form.Label>Sending Amount</Form.Label>
              <Form.Control
                placeholder='Amount/units to send'
                id='formAmount'
                className='mb-3'
                onChange={(e) => handleUnitsInput(e.target.value)}
              ></Form.Control>
              {!unitsValid && (
                <Alert variant='danger'>
                  Invalid units entered, make sure you have enough balance
                  available in your wallet
                </Alert>
              )}
              <Button
                disabled={!addrValid || !unitsValid}
                onClick={() => {
                  addRow(
                    elAddrTo.value.toLowerCase(),
                    elAsset.value,
                    elAmount.value
                  );
                }}
              >
                Add Transfer
              </Button>
            </Form.Group>
          </Form>
          <hr />
          <h4>Transfer Details</h4>
          <Table striped bordered hover size='sm'>
            <thead>
              <tr>
                <th>#</th>
                <th>Receiver</th>
                <th>Asset</th>
                <th>Units</th>
                <th>Actions</th>
              </tr>
            </thead>
            {receivers.map((x, xindex) => (
              <tbody key={x.to}>
                {x.coins.map((y, yindex) => (
                  <tr key={x.to + "-" + y.denom}>
                    <td>{xindex + " - " + yindex}</td>
                    <td>{x.to}</td>
                    <td>{y.denom}</td>
                    <td>{y.amount}</td>
                    <td>
                      <Button onClick={() => deleteRow(xindex, yindex)}>
                        Delete Row
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </Table>
          <Form.Group className='mb-3'>
            <Form.Label>Import CSV File</Form.Label>
            <Form.Control
              type='file'
              accept='.csv'
              onChange={(e) => handleUploadCSV(e.target.files[0])}
              id='csvFile'
            />
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Button
            disabled={receivers?.length <= 0}
            onClick={() =>
              receivers?.length > 1 || receivers[0]?.coins.length > 1
                ? newBatchTransfer()
                : newTransfer()
            }
          >
            {receivers?.length > 1 || receivers[0]?.coins.length > 1
              ? "Finalise Batch Transfer"
              : "Finalise Transfer"}
          </Button>
        </Card.Footer>
      </Card>
    </>
  );
};

export default Transfer;
