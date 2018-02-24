import React, {Component} from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Col,
    FormControl,
    Label,
    Input,
    FormFeedback
} from 'reactstrap';

export default class BuyTicketDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fields: {},
            valid:{
                trainDate: '',
                trainNo: '',
                from: '',
                to: ''
            },
        };
    }
    
    componentWillReceiveProps(props) {
        this.setState ({
            fields: {},
            valid:{
                trainDate: '',
                trainNo: '',
                from: '',
                to: ''
            },
            buyFailed: false,
            isBuying: false
        });
    }

    onInputChange(event) {
        event.preventDefault();
        this.setState({
            fields: {
                ...this.state.fields,
                [event.target.name]: event.target.value
            },
            valid: {
                ...this.state.valid,
                [event.target.name]: event.target.value?true:false
            }
        });
    }

    onBlur(event) {
        this.setState({
            valid: {
                ...this.state.valid,
                [event.target.name]: event.target.value?true:false
            }
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        for (var key in this.state.valid) {
            if(this.state.valid[key] !== true ) {
                return;
            }
        }

        this.setState({isBuying: true, buyFailed: false});
        fetch('/ticket/buy?trainDate='+this.state.fields['trainDate']+'&trainNo='+this.state.fields['trainNo']+'&fromStation='+this.state.fields['from']+'&toStation='+this.state.fields['to'], {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
            })
            .then(this.handleErrors)
            .then(function(response) {
                console.log("ok");
                this.props.handleHide();
            }).catch(function(error) {
                this.setState({isBuying: false, buyFailed: true});
        
            }.bind(this));
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.json());
        }
        return response;
    }

    render() {
        return (
            <Modal
                isOpen={this.props.show}
                toggle={this
                .props
                .handleHide
                .bind(this)}
                className={this.props.className}>
                <ModalHeader
                    toggle={this
                    .props
                    .handleHide
                    .bind(this)}>
                    {this.state.buyFailed
                        ? "Buy Ticket failed - please try again"
                        : "Buy Ticket"}
                </ModalHeader>
                <ModalBody>
                    <Form
                        horizontal
                        onSubmit={this
                        .handleSubmit
                        .bind(this)}>
                        <FormGroup row>
                            <Label for="trainDate" sm={3} className="col-form-label">Train Date</Label>
                            <Col sm={9}>
                                <Input
                                    name="trainDate"
                                    valid={this.state.valid['trainDate']}
                                    type="date"
                                    placeholder="Train Date"
                                    value={this.state.fields['trainDate']}
                                    onBlur={this.onBlur.bind(this)}
                                    onChange={this
                                    .onInputChange
                                    .bind(this)}/>
                                <FormFeedback>Train Date is mandatory</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="trainNo" sm={3} className="col-form-label">Train No</Label>
                            <Col sm={9}>
                                <Input
                                    type="text"
                                    name="trainNo"
                                    placeholder="Train No"
                                    valid={this.state.valid['trainNo']}
                                    value={this.state.fields['trainNo']}
                                    onBlur={this.onBlur.bind(this)}
                                    onChange={this
                                    .onInputChange
                                    .bind(this)}/>
                                <FormFeedback>Train No is mandatory</FormFeedback>
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="from" sm={3} className="col-form-label">From</Label>
                            <Col sm={9}>
                                <Input
                                    name="from"
                                    type="text"
                                    placeholder="From"
                                    valid={this.state.valid['from']}
                                    value={this.state.fields['from']}
                                    onBlur={this.onBlur.bind(this)}
                                    onChange={this
                                    .onInputChange
                                    .bind(this)}/>
                                <FormFeedback>From station is mandatory</FormFeedback>    
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Label for="to" sm={3} className="col-form-label">To</Label>
                            <Col sm={9}>
                                <Input
                                    name="to"
                                    type="text"
                                    placeholder="To"
                                    valid={this.state.valid['to']}
                                    value={this.state.fields['to']}
                                    onBlur={this.onBlur.bind(this)}
                                    onChange={this
                                    .onInputChange
                                    .bind(this)}/>
                                <FormFeedback>To station is mandatory</FormFeedback>  
                            </Col>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        type="submit"
                        onClick={this
                        .handleSubmit
                        .bind(this)}>
                        {this.state.isBuying
                            ? "Buying..."
                            : "Buy"}
                    </Button>
                    <Button onClick={this.props.handleHide}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
}