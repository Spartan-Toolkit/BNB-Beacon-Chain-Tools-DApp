import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import { useBbc } from "../../Web3BNB";
import { BnbClientContext } from "../../Web3BNB/providers/BnbClientProvider";
import { getNetwork } from "../../Web3BNB/utils/network";

const Transfer = () => {
  const client = useContext(BnbClientContext);
  const { address, balances, chainId } = useBbc();

  const [, setrefresh] = useState(0);
  const [prefix, setprefix] = useState(null);

  const [manualEntry, setmanualEntry] = useState(false);
  const [csvEntry, setcsvEntry] = useState(false);
  const [addrValid, setaddrValid] = useState(true);
  const [unitsValid, setunitsValid] = useState(true);

  // Form State
  const [asset, setasset] = useState("default");
  const [addrTo, setaddrTo] = useState(null);
  const [amount, setamount] = useState(0);
  const [csvFile, setcsvFile] = useState(null);
  const [memo, setmemo] = useState("");
  const [receivers, setreceivers] = useState([]);

  // Toast State (Move into other component/provider)
  const [showToast, setshowToast] = useState(false);
  const [txnHash, settxnHash] = useState(undefined);

  useEffect(() => {
    if (txnHash) {
      setshowToast(true);
    }
  }, [txnHash]);

  useEffect(() => {
    setprefix(getNetwork(chainId).prefix);
    setmanualEntry(false);
    setcsvEntry(false);
    setreceivers([]);
  }, [chainId]);

  useEffect(() => {
    if (client && addrTo && prefix) {
      const isValid = client.checkAddress(addrTo.toLowerCase(), prefix);
      setaddrValid(isValid);
    }
  }, [client, addrTo, prefix]);

  useEffect(() => {
    if (amount && asset && balances) {
      const balance = balances.filter((x) => x.symbol === asset)[0].free;
      if (amount > 0 && amount <= balance) {
        setunitsValid(true);
      } else {
        setunitsValid(false);
      }
    }
  }, [amount, asset, balances]);

  const newTransfer = async () => {
    console.log(client);
    const txn = await client.transfer(
      address, // Address From (String)
      receivers[0].to, // Address To (String)
      receivers[0].coins[0].amount, // Amount (Float)
      receivers[0].coins[0].denom, // Asset Symbol (String) ie. "BNB"
      memo // Txn Memo (String)
    );
    console.log(txn);
    settxnHash(txn.result[0].hash);
    setmanualEntry(false);
    setcsvEntry(false);
  };

  const newBatchTransfer = async () => {
    console.log(client);
    console.log(receivers);
    try {
      const txn = await client.multiSend(
        address, // Address From (String)
        receivers.map((rec) => {
          return {
            to: rec.to,
            coins: rec.coins.map((coin) => {
              return {
                denom: coin.denom,
                amount: coin.amount.toString(),
              };
            }),
          };
        }),
        // receiversBAK, // Outputs (Transfer[{to, coins[denom, amount]},{to, coins[denom, amount]},...])
        memo // Txn Memo (String)
      );
      console.log("a txn", txn);
      settxnHash(txn.result[0].hash);
    } catch (err) {
      console.error("Transfer Error!", err);
    }
    // setreceivers([]); // Have to clear form on error due to bug that exponentially increases units (might be bnc, might be BW, might be dapp)
    // To recreate, just do a valid multisend txn but reject the txn instead of approving and the next time to open the same txn the values will be higher
    setmanualEntry(false);
    setcsvEntry(false);
  };

  // const handleUploadCSVMULTIASSET = (csvFile) => {
  //   if (csvFile) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const text = e.target.result;
  //       console.log(text);
  //       const rows = text.split(/\r\n|\n|\r/);
  //       console.log(rows);
  //       for (let i = 0; i < rows.length; i += 1) {
  //         const entries = rows[i].split(",");
  //         console.log(entries);
  //         if (entries.length === 3) {
  //           if (!handleAddrInput(entries[0])) {
  //             console.log("Invalid address in row " + i, entries[0]); // validate address
  //           } else if (balances) {
  //             const balance = balances.filter((x) => x.symbol === entries[1]);
  //             if (!balance || balance.length <= 0) {
  //               console.log("Invalid asset in row " + i, entries[1]); // validate asset
  //               // TODO: validate amount
  //             } else {
  //               addRow(entries[0], entries[1], entries[2]);
  //             }
  //           } else {
  //             console.log("No wallet connected?");
  //           }
  //         } else {
  //           console.log("Invalid row " + i, entries);
  //         }
  //       }
  //     };
  //     reader.readAsText(csvFile);
  //   }
  //   elCsvFile.value = null;
  // };

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
          if (entries.length === 2) {
            if (!client.checkAddress(entries[0].toLowerCase(), prefix)) {
              console.log("Invalid address in row " + i, entries[0]); // validate address
            } else if (balances) {
              const balance = balances.filter((x) => x.symbol === asset);
              if (!balance || balance.length <= 0) {
                console.log("Invalid asset in row " + i, asset); // validate asset
                // TODO: validate amount
              } else {
                addRow(entries[0], asset, entries[1]);
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
  };

  const addRow = (toAddr, toAsset, toAmount) => {
    const _toAddr = toAddr.toLowerCase();
    if (client.checkAddress(_toAddr, prefix)) {
      const _array = receivers;
      console.log(_array);
      const recIndex = _array.findIndex((x) => x.to === _toAddr);
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
          to: _toAddr,
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

  const toggleMethod = (type) => {
    if (type === "csv") {
      setcsvEntry(true);
      setmanualEntry(false);
    } else if ((type = "manual")) {
      setcsvEntry(false);
      setmanualEntry(true);
    }
  };

  return (
    <>
      <ToastContainer
        className='p-3'
        position='top-end'
        style={{ marginTop: "30px", zIndex: 1000 }}
      >
        <Toast
          onClose={() => setshowToast(false)}
          show={showToast}
          delay={6000}
          autohide
        >
          <Toast.Header>
            <strong className='me-auto'>Transaction broadcasted</strong>
          </Toast.Header>
          <Toast.Body>
            Open in explorer:{" "}
            <a
              href={"https://testnet-explorer.binance.org/tx/" + txnHash}
              target='_blank'
              rel='noreferrer'
            >
              {txnHash}
            </a>
          </Toast.Body>
        </Toast>
      </ToastContainer>
      <h5>Transfer</h5>
      <Card className='mb-3'>
        <Card.Header onClick={() => console.log(window.BinanceChain)}>
          Single Transfer / Batch Transfer
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col xs='12'>
                <h6>Step 1: Connect wallet & confirm asset</h6>
              </Col>
              <Form.Group as={Col} md='6'>
                <Form.Label>Your wallet address</Form.Label>
                <Form.Control
                  size='sm'
                  placeholder={address ?? "Connect wallet first"}
                  disabled
                />
              </Form.Group>
              <Form.Group as={Col} md='6'>
                <Form.Label>
                  Select {receivers.length === 0 ? "first" : "another"} asset to
                  send
                </Form.Label>
                <Form.Select
                  size='sm'
                  id='formAsset'
                  onChange={(e) => setasset(e.target.value)}
                >
                  <option value='default'>
                    {balances?.length > 0
                      ? "Select asset to send"
                      : address
                      ? "Selected wallet is empty"
                      : "Connect wallet first"}
                  </option>
                  {balances?.length > 0 &&
                    balances.map((x) => (
                      <option key={x.symbol} value={x.symbol}>
                        {x.symbol + " (Balance: " + x.free + ")"}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
              <Col xs='12' className='my-2'>
                <hr />
              </Col>
              <Col xs='12'>
                <h6>Step 2: Enter one or more recipients</h6>
                <Button
                  size='sm'
                  onClick={() => toggleMethod("manual")}
                  className='me-2'
                  disabled={asset === "default"}
                >
                  Enter Manually
                </Button>
                OR
                <Button
                  size='sm'
                  onClick={() => toggleMethod("csv")}
                  className='ms-2'
                  disabled={asset === "default"}
                >
                  Import CSV File
                </Button>
              </Col>
              {manualEntry && (
                <>
                  <Form.Group as={Col} md='6'>
                    <Form.Label>Recipient address</Form.Label>
                    <Form.Control
                      size='sm'
                      placeholder={"Receiving address (" + prefix + "...)"}
                      id='formAddrTo'
                      onChange={(e) => setaddrTo(e.target.value)}
                      isInvalid={!addrValid}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Make sure address is valid & starts with "{prefix}"
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md='6'>
                    <Form.Label>Recipient amount</Form.Label>
                    <Form.Control
                      type='number'
                      size='sm'
                      placeholder='Amount/units to send (ie. 0.001)'
                      id='formAmount'
                      onChange={(e) => setamount(e.target.value)}
                      isInvalid={!unitsValid}
                    ></Form.Control>
                    <Form.Control.Feedback type='invalid'>
                      Make sure you have enough balance available in your wallet
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Col xs='12' className='mt-2'>
                    <Button
                      size='sm'
                      disabled={!addrValid || !unitsValid}
                      onClick={() => {
                        addRow(addrTo.toLowerCase(), asset, amount);
                      }}
                    >
                      Add Transfer
                    </Button>
                  </Col>
                </>
              )}
              {csvEntry && (
                <>
                  <Col xs='12' className='my-2'>
                    <Form.Label>Import CSV file</Form.Label>
                    <InputGroup>
                      <Form.Control
                        style={{ maxWidth: "320px" }}
                        size='sm'
                        type='file'
                        accept='.csv'
                        id='csvFile'
                        onChange={(e) => setcsvFile(e.target.files[0])}
                      />
                      <Button
                        size='sm'
                        disabled={!addrValid || !unitsValid}
                        onClick={() => {
                          console.log(csvFile);
                          handleUploadCSV(csvFile);
                        }}
                      >
                        Add Transfers
                      </Button>
                    </InputGroup>
                  </Col>
                  <Col xs='12' className='my-2'>
                    <Form.Label>CSV format to use</Form.Label>
                    <br />
                    <small>
                      | ReceiverAddress | SendAmount | <br />
                      ie. [bnb1uivhns894nsovgnjk, 0.0001, bnb1jkfv83bnfisfhnk,
                      1.234, etc...]
                    </small>
                    <br />
                    <a
                      href='https://docs.google.com/spreadsheets/d/1MGijt6gBPc1vGNoXbNsB8sDgpC9bpIzrYLtUpY1P8jo/edit?usp=sharing'
                      target='_blank'
                      rel='noreferrer'
                    >
                      See GoogleSheets example CSV
                    </a>
                  </Col>
                </>
              )}
            </Row>
          </Form>
          <Row>
            <Col xs='12' className='my-2'>
              <hr />
              <h6>Step 3: Review the transfer/s</h6>
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
                          <Button
                            size='sm'
                            onClick={() => deleteRow(xindex, yindex)}
                          >
                            Delete Row
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </Table>
            </Col>
            <Col xs='12'>
              <hr />
              <h6>Step 4: Add memo & check</h6>
            </Col>
            <Form.Group as={Col} md='6'>
              <Form.Label>
                Final Step: Would you like a Txn Memo? (Optional)
              </Form.Label>
              <Form.Control
                size='sm'
                placeholder='Memo (Optional)'
                id='formMemo'
                onChange={(e) => setmemo(e.target.value)}
              />
            </Form.Group>
            <Col md='6'>
              <Form.Label>Want to do a batch transfer?</Form.Label>
              <h6>
                If you would like to send an extra asset in the same
                transaction, return to step 1 and repeat!
              </h6>
              <h6>
                If you would like to send to an extra address in the same
                transaction, return to step 2 and repeat!
              </h6>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Button
            size='sm'
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
