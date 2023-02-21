import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Transaction.css";
import findIdByName from "../../helpers/findIdbyName";

import TransactionTable from "../../components/TransactionTable";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import DialogContent from "@mui/material/DialogContent";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function Transactions() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [wallet, setWallet] = useState("");
  const [wallet_id, setWalletId] = useState(0);
  const [coin, setCoin] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [price, setPrice] = useState(0);

  const [newTxn, setNewTxn] = useState({});
  const [userTxns, setUserTxns] = useState([]);

  const [userWallets, setUserWallets] = useState([]);

  async function getUserWallet() {
    const response = await axios.get(
      "http://localhost:3001/wallets/getAllWallets",
      { params: { user_id: 1 } }
    );
    const data = response.data.wallets;
    setUserWallets(data);
  }

  async function getUserTransaction() {
    const response = await axios.get(
      "http://localhost:3001/transaction/getAllTransactions",
      { params: { user_id: 1 } }
    );
    const data = response.data;
    console.log(data);
    setUserTxns(data);
  }

  useEffect(() => {
    getUserWallet();
    getUserTransaction();
  }, []);

  useEffect(() => {
    console.log(userTxns);
  }, [userTxns]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeForm = (e) => {
    if (e.target.name === "wallet") {
      setWallet(e.target.value);
      const wallet_id = findIdByName(e.target.value, userWallets);
      setWalletId(wallet_id);
    } else if (e.target.name === "coin") {
      setCoin(e.target.value);
    } else if (e.target.name === "type") {
      setType(e.target.value);
    } else if (e.target.name === "quantity") {
      setQuantity(e.target.value);
    } else if (e.target.name === "price") {
      setPrice(e.target.value);
    }

    setNewTxn({
      user_id: 1,
      wallet_id: wallet_id,
      date: date,
      wallet: wallet,
      coin: coin,
      type: type,
      quantity: quantity,
      price: price,
    });
  };

  useEffect(() => {
    console.log(newTxn);
  }, [newTxn]);

  const handleSubmitForm = async (e) => {
    if (date && wallet && coin && type && quantity && price) {
      console.log(newTxn);
    }

    const addTxn = await axios.post(
      "http://localhost:3001/transactions/addTransaction",
      newTxn
    );

    setOpen(false);
  };

  return (
    <div className="Screen">
      <div>
        <Button variant="contained" onClick={handleClickOpen}>
          + New Transaction
        </Button>

        <Dialog maxWidth={"lg"} open={open} onClose={handleClose}>
          <DialogTitle>Add Transaction</DialogTitle>

          <DialogContent style={{ maxHeight: "400px" }}>
            <form className="form">
              <Box sx={{ minWidth: 120, marginLeft: 2, marginRight: 2 }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    label="Date"
                    value={date}
                    onChange={(newValue) => {
                      const newdate = newValue.format("YYYY-MM-DD");
                      setDate(newdate);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Box>

              <Box sx={{ minWidth: 120, marginLeft: 2, marginRight: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-standard-label">
                    Wallet
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={wallet}
                    label="Wallet"
                    name="wallet"
                    onChange={handleChangeForm}
                  >
                    {userWallets.map((data) => (
                      <MenuItem key={`${data.name}`} value={data.name}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ minWidth: 120, marginLeft: 2, marginRight: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-standard-label">
                    Type
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={type}
                    label="Type"
                    name="type"
                    onChange={handleChangeForm}
                  >
                    <MenuItem value="Buy">Buy</MenuItem>
                    <MenuItem value="Sell">Sell</MenuItem>
                    <MenuItem value="Deposit">Deposit</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextField
                sx={{ marginLeft: 2, marginRight: 2 }}
                label="Coin"
                name="coin"
                value={coin}
                onChange={handleChangeForm}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
              />

              <TextField
                sx={{ marginLeft: 2, marginRight: 2 }}
                id="standard-number"
                label="Quantity"
                type="number"
                name="quantity"
                value={quantity}
                onChange={handleChangeForm}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
              />
              <TextField
                sx={{ marginLeft: 2, marginRight: 2 }}
                id="standard-number"
                label="Price"
                type="number"
                name="price"
                value={price}
                onChange={handleChangeForm}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="standard"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmitForm}>Submit</Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className="table">
        <TransactionTable />
      </div>
    </div>
  );
}
