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
import { RingLoader } from 'react-spinners';

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
import BuyTicketDialog from './BuyTicketDialog';
import store from "../../store/Store.js";

class Ticket extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            expanded: false,
            show: false,
            tableData: [],
            activeTab: 'summary',
            albumTabs: [],
            selectedRows: {},
            searchDate: this.formatDate(this.jumpToNextFriday(new Date())),
            loading: true
        };

        this.selectRowProp = {
            mode: 'checkbox'
        }
    }

    toggle(tab) {
        if (this.albumTabsClosing === tab) {
            this.albumTabsClosing = '';
        } else if (this.state.activeTab !== tab) {
            this.setState({activeTab: tab});
        }
    }

    onExpand() {
        this.setState({expanded:!this.state.expanded});
    }

    onBuy(id, btnDisabled) {
        if(!btnDisabled){
            this.setState({show: true});
        }
    }

    onSearchDateChange(event) {
        this.setState({searchDate: event.target.value,loading: true});
        this.refreshTable(event.target.value);
    }

    onSubmit() {
        this.refreshTable(this.state.searchDate);
    }

    componentWillMount() {
        this.refreshTable(this.state.searchDate);
    }

    jumpToNextFriday(date) {
        return new Date(+date+(7-(date.getDay()+2)%7)*86400000);
      }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    }

    refreshTable(searchDate) {
        console.log("refresh " + searchDate);
        fetch('/ticket/query?trainDate='+searchDate+'&fromStation=SZQ&toStation=GGQ', {
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
                data = data.filter(row => row['from']==='NZQ'&&row['to']==='IZQ');
                this.setState({tableData: data});
                this.setState({loading: false});
            }.bind(this))
    }

    handleHide() {
        console.log("handleHide");
        this.setState({show: false});
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
        let btnClass = "btn btn-success"
        let btnDisabled = false;
        if(!(row.firstClass === '有' || row.firstClass>0)) {
            btnDisabled = true;
            btnClass = btnClass+ ' disabled';
        }
        return <span>
            <button
                className={btnClass}
                type="submit"
                onClick={(this.onBuy.bind(this, row.id, btnDisabled))}>
                Buy
            </button>

        </span>;
    }

    render() {
        const style = this.state.expanded ? {width : "200px"} : {};
        const mainStyle = this.state.expanded ? {marginLeft : "200px"} : {};
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

                            <div id="mySidenav" className="sidenav" style={style}>
                                <input type="date" name="date" id="date" value={this.state.searchDate} onChange={this.onSearchDateChange.bind(this)} placeholder="with a placeholder" />
                            </div>

                    
                            <div id="main" style={mainStyle}>

                                <button
                                    className="btn m-2"
                                    type="submit"
                                    onClick={(this.onExpand.bind(this))}>
                                    <i className="fa fa-filter"></i>
                                </button>
                                <button
                                    className="btn btn-success m-2"
                                    type="submit"
                                    onClick={(this.onBuy.bind(this))}>
                                    Buy Ticket
                                </button>
                                <BuyTicketDialog
                                    show={this.state.show}
                                    onSubmit={this
                                    .onSubmit
                                    .bind(this)}
                                    isEdit={this.state.isEdit}
                                    selected={this.state.selected}
                                    handleHide={this
                                    .handleHide
                                    .bind(this)}>
                                </BuyTicketDialog>

                            <div className='sweet-loading'>
                                    <RingLoader
                                    color={'#123abc'} 
                                    loading={this.state.loading} 
                                    />
                                </div>
                                {!this.state.loading &&
                                <BootstrapTable
                                    version='4'
                                    data={this.state.tableData}
                                    striped={true}
                                    hover={true}
                                    options={this.options} pagination>
                                    <TableHeaderColumn width='80' dataField="no" isKey={true} dataSort={true}>
                                        No
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="start" dataSort={true}>
                                        Start
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="end" dataSort={true}>
                                        End
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="from" dataSort={true}>
                                        From
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="to" dataSort={true}>
                                        To
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="startTime" dataSort={true}>
                                        StartTime
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="endTime" dataSort={true}>
                                        EndTime
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="duration" dataSort={true}>
                                        Duration
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="firstClass" dataSort={true}>
                                        FirstClass
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="secondClass" dataSort={true}>
                                        SecondClass
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='80' dataField="businessClass" dataSort={true}>
                                        BusinessClass
                                    </TableHeaderColumn>
                                    <TableHeaderColumn width='150'dataField="button" dataFormat={this.buttonFormatter.bind(this)}>
                                        Buttons
                                    </TableHeaderColumn>
                                </BootstrapTable>}
                                </div>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>
            </div>
        )
    }
}

export default Ticket;