import React, {Component} from 'react';
import '../../App.css';
import classnames from 'classnames';
import {
    Table,
    Button,
    Panel,
    Modal,
    Form,
    FormGroup,
    Col,
    FormControl,
    Checkbox,
    ControlLabel
} from 'react-bootstrap';

import {
    TabPane,
    Row,
    Card,
    CardTitle,
    CardText,
    Nav,
    NavLink,
    NavItem,
    TabContent
} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import TripDialog from './TripDialog';
import PhotoDialog from './PhotoDialog';
import Album from './Album';
import store from "../../store/Store.js";

class Trip extends Component {
    constructor(props) {
        super(props);

        this.toggle = this
            .toggle
            .bind(this);

        this.state = {
            show: false,
            tableData: [],
            activeTab: 'summary',
            albumTabs: [],
            selectedRows: {}
        };

        this.selectRowProp = {
            mode: 'checkbox'
        }

        this.options = {
            afterDeleteRow: this.onAfterDeleteRow
        };

    }

    toggle(tab) {
        if (this.albumTabsClosing === tab) {
            this.albumTabsClosing = '';
        } else if (this.state.activeTab !== tab) {
            this.setState({activeTab: tab});
        }
    }

    onAfterDeleteRow(rowKeys) {
        rowKeys.forEach(row => {
            fetch('/trip/' + row, {
                    method: 'delete',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(function (response) {
                    console.log(response.statusText);
                })
        });

    }

    onDelete(key) {
        fetch('/trip/' + key, {
                method: 'delete',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
            this.refreshTable();
        }.bind(this));
    }

    onEdit(row) {
        this.setState({show: true, isEdit: true, selected: row});
    }

    onViewPhotos(row) {
        this.setState({showPhoto: true, selected: row});
    }

    onViewPhotos2(row) {
        const tabName = row.destination;
        this.setState({
            showPhoto2: true,
            selected: row,
            activeTab: row.destination,
            albumTabs: [
                ...this.state.albumTabs,
                row.destination
            ],
            selectedRows: {
                ...this.state.selectedRows,
                [tabName]: row
            }
        });
    }

    onSubmit() {
        this.refreshTable();
    }

    componentWillMount() {
        this.refreshTable();
    }

    refreshTable() {
        fetch('/trip', {
                method: 'get',
                headers: {
                    'Authorization' : store.someData ,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                this.setState({tableData: data});
            }.bind(this))
    }

    onAddTripClick() {
        this.setState({show: true, isEdit: false, selected: {}});
    }

    handleHide() {
        this.setState({show: false});
    }

    handlePhotoHide() {
        this.setState({showPhoto: false});
    }

    priceFormatter(cell, row) {
        return '<i className="glyphicon glyphicon-usd"></i> ' + cell;
    }

    onTabClose(tab) {
        this.albumTabsClosing = tab;
        this.setState({
            albumTabs: this
                .state
                .albumTabs
                .filter(tab => tab !== tab),
            activeTab: 'summary'
        })
    }

    buttonFormatter(cell, row) {
        return <span>
            <button
                className="btn btn-danger"
                type="submit"
                onClick={(this.onDelete.bind(this, row.id))}>
                <i className="fa fa-trash-o" aria-hidden="true"></i>
            </button>
            <button
                className="btn btn-primary"
                type="submit"
                onClick={(this.onEdit.bind(this, row))}>
                <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
            </button>
            <button
                className="btn btn-secondary"
                type="submit"
                onClick={(this.onViewPhotos2.bind(this, row))}>
                <i className="fa fa-eye" aria-hidden="true"></i>
            </button>
            <button
                className="btn btn-info"
                type="submit"
                onClick={(this.onViewPhotos.bind(this, row))}>
                <i className="fa fa-eye" aria-hidden="true"></i>
            </button>

        </span>;
    }

    render() {
        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({
                            active: this.state.activeTab === 'summary'
                        })}
                            onClick={() => {
                            this.toggle('summary');
                        }}
                            style={{
                            cursor: "pointer"
                        }}>
                            Summary
                        </NavLink>
                    </NavItem>
                    {this
                        .state
                        .albumTabs
                        .map(tab => {
                            return <NavItem>
                                <NavLink
                                    className={classnames({
                                    active: this.state.activeTab === tab
                                })}
                                    onClick={() => {
                                    this.toggle(tab);
                                }}
                                    style={{
                                    cursor: "pointer"
                                }}>
                                    {tab}
                                    <button
                                        type="button"
                                        className="close"
                                        aria-label="Close"
                                        onClick={this
                                        .onTabClose
                                        .bind(this, tab)}>
                                        <span className="ml-3" aria-hidden="true">&times;</span>
                                    </button>
                                </NavLink>
                            </NavItem>
                        })
}

                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="summary">
                        <Row>
                            <Col sm="12">
                                <button
                                    className="btn btn-success btn-padding mt-3"
                                    onClick={this
                                    .onAddTripClick
                                    .bind(this)}>
                                    Add Trip
                                </button>
                                <TripDialog
                                    show={this.state.show}
                                    onSubmit={this
                                    .onSubmit
                                    .bind(this)}
                                    isEdit={this.state.isEdit}
                                    selected={this.state.selected}
                                    handleHide={this
                                    .handleHide
                                    .bind(this)}></TripDialog>

                                {
                                    this.state.showPhoto
                                    ? <PhotoDialog
                                            size="lg"
                                            showPhoto={this.state.showPhoto}
                                            selected={this.state.selected}
                                            handleHide={this
                                            .handlePhotoHide
                                            .bind(this)}></PhotoDialog>
                                    : <span></span>
}

                                <BootstrapTable
                                    version='4'
                                    data={this.state.tableData}
                                    striped={true}
                                    hover={true}
                                    options={this.options}>
                                    <TableHeaderColumn
                                        dataField="id"
                                        isKey={true}
                                        hidden={true}
                                        dataAlign="center"
                                        dataSort={true}>
                                        ID
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='150' dataField="destination" dataSort={true}>
                                        Destination
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='150' dataField="fromDate" dataSort={true}>
                                        From
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='150' dataField="toDate" dataSort={true}>
                                        To
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='150' dataField="path" dataSort={true}>
                                        Path
                                    </TableHeaderColumn>
                                    <TableHeaderColumn
                                        width='150'
                                        dataField="button"
                                        dataFormat={this
                                        .buttonFormatter
                                        .bind(this)}>Buttons</TableHeaderColumn>
                                </BootstrapTable>
                            </Col>
                        </Row>
                    </TabPane>
                    {this
                        .state
                        .albumTabs
                        .map(tab => {
                            return <TabPane tabId={tab}>
                                <Album selected={this.state.selectedRows[tab]}/>
                            </TabPane>
                        })
}

                </TabContent>

            </div>
        )
    }
}

export default Trip;