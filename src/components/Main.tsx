import React, { Component } from "react";
import SendTransaction from "./SendTransaction";
import Web3 from "web3";
import { Button } from "reactstrap";
import tokenABI from "./../WeenusToken.json";

interface IState {
  account: string;
  rethBalance: string;
  weenusTokenBalance: string;
}
interface IProps {}
declare const window: any;
class Main extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      account: "",
      rethBalance: "",
      weenusTokenBalance: "",
    };
  }
  componentDidMount() {
    this.getEtherem();
  }

  connectToMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      const accounts = await window.ethereum.enable();
      this.setState({
        account: accounts[0],
      });
      this.getAllBalance(accounts[0], window.web3);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  getEtherem = async () => {
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    this.getAllBalance(accounts[0], web3);
  };

  getAllBalance = async (account: string, web3: any) => {
    if (account?.length > 0) {
      this.setState({
        account,
      });
      this.getRETHBalance(web3, account, this);
      this.getWeenusBalance(web3, account, this);
    }
  };

  getRETHBalance = async (web3: any, account: string, that: any) => {
    web3.eth.getBalance(account, function (error: any, result: any) {
      if (error) {
        console.log(error);
      } else {
        that.setState({ rethBalance: result });
      }
    });
  };

  getWeenusBalance = async (web3: any, account: string, that: any) => {
    let tokenAddress = "0x101848D5C5bBca18E6b4431eEdF6B95E9ADF82FA";
    let walletAddress = account;
    const contractInstance = new web3.eth.Contract(tokenABI, tokenAddress, {
      from: walletAddress, // default from address
      gasPrice: "20000000000", // default gas price in wei, 20 gwei in this case
    });
    await contractInstance.methods
      .balanceOf(walletAddress)
      .call()
      .then((result: any) => {
        that.setState({ weenusTokenBalance: result });
      })
      .catch(function (err: any) {
        console.log("err...\n" + err);
      });
  };

  sendTransaction = async (amount: string, receiverAddress: string) => {
    let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
    const accounts = await web3.eth.getAccounts();
    if (amount && receiverAddress) {
      const sender = accounts[0];
      const receiver = receiverAddress;
      const web3s = new Web3(window.ethereum);
      web3s.eth.sendTransaction({
        to: receiver,
        from: sender,
        value: amount,
      });
    }
  };

  render() {
    const { account, rethBalance, weenusTokenBalance } = this.state;
    return (
      <div className="container">
        <p>
          {account?.length > 0
            ? `You are connected to account: ${account}`
            : "Metamask not connected!"}
        </p>
        <Button
          disabled={account?.length > 0}
          color="success"
          onClick={this.connectToMetamask}
        >
          Connect to Metamask
        </Button>
        <p>
          Your rETH Balance is:{" "}
          {rethBalance?.length > 0 ? `$${rethBalance} USD` : "Not Found"}
        </p>
        <p>
          Your Weenus token Balance is:{" "}
          {weenusTokenBalance?.length > 0
            ? `$${weenusTokenBalance} USD`
            : "Not Found"}
        </p>
        <SendTransaction sendTransaction={this.sendTransaction} />
      </div>
    );
  }
}

export default Main;
