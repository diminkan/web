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
    Input
 } from 'reactstrap';

export default class TripDialog extends Component {

    constructor(props) {
        super(props);
        console.log("selected"+props.selected);
 
        this.state = {
            destination: '',
            path:''
        };
    }

    componentWillReceiveProps(props) {
        console.log("selected"+props.selected);
        if(props.selected){
            console.log(props.selected.path);
            this.setState(
                {
                    destination : props.selected.destination,
                    path: props.selected.path,
                    from: props.selected.fromDate,
                    to: props.selected.toDate
                });
        } else {
            this.setState({destination: '', path: '', from: '', to:''});
        }
    }

    onEmailChange(event) {
        event.preventDefault();
        this.setState({destination: event.target.value});
    }

    onPathChange(event) {
        event.preventDefault();
        this.setState({path: event.target.value});
    }

    onFromChange(event) {
        this.setState({from: event.target.value});
    }

    onToChange(event) {
        this.setState({to: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let body = {destination: this.state.destination, path: this.state.path, fromDate: this.state.from, toDate: this.state.to};
        if(this.props.isEdit) {
            body = {...body, id : this.props.selected.id};
        }

        fetch('http://192.168.1.127:8080/trip', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
                body: JSON.stringify(body)
            })
            .then(function (response) {
                console.log(response.statusText);
                this.props.onSubmit();
                this.props.handleHide();
            }.bind(this));
    }

    render() {
        return (
            <Modal isOpen={this.props.show} toggle={this.props.handleHide.bind(this)} className={this.props.className}>
            <ModalHeader toggle={this.props.handleHide.bind(this)}>
                    {this.props.isEdit ? "Edit Trip" : "Add Trip"}
            </ModalHeader>
            <ModalBody>
                      <Form
                         horizontal
                         onSubmit={this
                         .handleSubmit
                         .bind(this)}>
                         <FormGroup row>
                         <Label for="destination" sm={2}>Destination</Label>
          <Col sm={10}>
            <Input type="text" name="destination" id="destination" placeholder="Destination" 
            value={this.state.destination}
            onChange={this
            .onEmailChange
            .bind(this)}/>
          </Col>
          </FormGroup>

                         <FormGroup row>
                             <Col sm={2}>
                                 Path
                             </Col>
                            
                             <Col sm={10}>
                                 <Input
                                     type="text"
                                     placeholder="Path"
                                     value={this.state.path}
                                     onChange={this
                                     .onPathChange
                                     .bind(this)}/>
                             </Col>
                         </FormGroup>

                         <FormGroup row>
                             <Col sm={2}>
                                 From
                             </Col>
                            
                             <Col sm={10}>
                                 <Input
                                     type="date"
                                     placeholder="From"
                                     value={this.state.from}
                                     onChange={this
                                     .onFromChange
                                     .bind(this)}/>
                             </Col>
                         </FormGroup>
                         <FormGroup row>
                             <Col sm={2}>
                                 To
                             </Col>
                            
                             <Col sm={10}>
                                 <Input
                                     type="date"
                                     placeholder="To"
                                     value={this.state.to}
                                     onChange={this
                                     .onToChange
                                     .bind(this)}/>
                             </Col>
                         </FormGroup> 
                     </Form> 
                       </ModalBody>
            <ModalFooter>
            <Button color="primary" type="submit" onClick={this.handleSubmit.bind(this)}>
            {this.props.isEdit ? "Edit" : "Add"}
            </Button>
<Button onClick={this.props.handleHide}>Close</Button>
            </ModalFooter>
          </Modal>
        )
    }
}