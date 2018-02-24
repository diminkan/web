import React, {Component} from 'react';
import {
    Button,
    Modal,
    Pagination,
    PaginationItem,
    PaginationLink,
    ModalHeader,
    ModalFooter,
    ModalBody
} from 'reactstrap';
import Img from 'react-image';
import Photo from './Photo';

import './PhotoDialog.css';

export default class PhotoDialog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            page: 1
        };

    }

    componentWillMount() {
        fetch('http://192.168.1.127:8080/files?path=' + this.props.selected.path, {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log("data " + JSON.stringify(data));
                this.setState({fileNames: data, loading: false});
            }.bind(this));
    }

    onNext() {
        this.setState({
            page: this.state.page + 1
        });
    }

    onImageClick(src) {
        window.open(src);
    }

    render() {
        const start = (this.state.page - 1) * 9;
        const end = (this.state.page) * 9;
        return (
            <Modal
                size="xl"
                isOpen={this.props.showPhoto}
                toggle={this.props.handleHide}
                container={this}
                aria-labelledby="contained-modal-title">
                <ModalHeader toggle={this.props.handleHide}>
                    View Photos
                </ModalHeader>
                <ModalBody>
                    {this.state.loading
                        ? <span>Loading...</span>
                        : <div>
                            <div className="row">
                                <div className="column">
                                    {this
                                        .state
                                        .fileNames
                                        .slice(start, end)
                                        .map(file => {
                                            const src = "http://192.168.1.127:8080/file?path=" + this.props.selected.path + "&name=" + file;
                                            return <Photo
                                                src={src}
                                                name={file}
                                                selected={this.props.selected}
                                                onImageClick={this
                                                .onImageClick
                                                .bind(this)}></Photo>
                                        })
}
                                </div>

                            </div>
                            <div>
                                <Pagination>
                                    <PaginationItem>
                                        <PaginationLink previous href="#"/>
                                    </PaginationItem>

                                    <PaginationItem>
                                        <PaginationLink href="#">
                                        {this.state.page}
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next onClick={this.onNext.bind(this)}/>
                                    </PaginationItem>
                                </Pagination>
                                {/* <Pagination>
                                    <Pagination.First/>
                                    <Pagination.Prev/>

                                    <Pagination.Item>{this.state.page}</Pagination.Item>

                                    <Pagination.Next onClick={this.onNext.bind(this)}/>
                                    <Pagination.Last/>
                                </Pagination> */}
                            </div>
                        </div>
}

                </ModalBody>
                <ModalFooter >
                    <Button onClick={this.props.handleHide}>Close</Button>
                </ModalFooter>
            </Modal>
        )
    }
}