import React, { Component } from "react";
import {
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";

interface IProps {
  sendTransaction: (amount: string, receiverAddress: string) => void;
}
interface IState {
  showModal: boolean;
  amount: string;
  receiverAddress: string;
}

class SendTransaction extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showModal: false,
      amount: "",
      receiverAddress: "0x0000000000000000000000000000000000000000",
    };
  }
  //this function is used to display and hide the form.
  toggle = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  submitData = () => {
    const { amount, receiverAddress } = this.state;
    this.toggle();
    this.props.sendTransaction(amount, receiverAddress);
  };
  render() {
    const { showModal, amount, receiverAddress } = this.state;
    return (
      <div>
        {/* user form */}
        <Modal isOpen={showModal} toggle={this.toggle}>
          <ModalHeader>Create New Transaction</ModalHeader>
          <ModalBody>
            <Form>
              <Row form>
                <FormGroup>
                  <Label for="amount">Amount</Label>
                  <Input
                    type="text"
                    name="amount"
                    id="amount"
                    value={amount}
                    onChange={(e) => this.setState({ amount: e.target.value })}
                    placeholder="123"
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="receiverAddress">Receiver Address</Label>
                  <Input
                    type="text"
                    name="receiverAddress"
                    id="receiverAddress"
                    value={receiverAddress}
                    onChange={(e) =>
                      this.setState({ receiverAddress: e.target.value })
                    }
                    placeholder="0xabc12..."
                  />
                </FormGroup>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.submitData}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={this.toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        {/* button to open form */}
        <Button color="info" onClick={this.toggle}>
          Send New Transaction
        </Button>
      </div>
    );
  }
}

export default SendTransaction;
