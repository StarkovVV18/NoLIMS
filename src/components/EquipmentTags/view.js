import React from 'react';
import { connect } from 'react-redux';
import { Table, Nav } from '@douyinfe/semi-ui'
import { IconRefresh, IconPlus } from '@douyinfe/semi-icons';

import agent from '../../agent';
import {
    
} from '../../constants/actionTypes';
import ModalCreateManufacturer from './modalCreate'
import { history } from '../../store';
import ButtonOpenCard from './../common/buttonOpenCard';

const mapStateToProps = state => ({
  ...state,
  currentUser: state.common.currentUser,
});
const mapDispatchToProps = dispatch => ({

  });

class EquipmentTypeView extends React.PureComponent {
    
    constructor(){
        super()

        this.state = {
            loading: true,
            currentPage: 1,
            pageSize: 20,
            sorter: {},
            dataSource: [],
            selectedRow: [],
            showCreate: false
        }
    }

    componentDidUpdate(){
        if (this.state.dataSource)
            this.setState({loading: false})
    }

    async getData(page, size, sorter){
        this.setState({...this.state, loading: true})

        if (typeof(page) == 'undefined' && typeof(size) == 'undefined')
        {
            const data = await agent.EquipmentTagsService.view(this.state.currentPage, this.state.pageSize, this.state.sorter)
            this.setState({...this.state, dataSource: data, loading: false, sorter: sorter})
        }
        else
        {
            const data = await agent.EquipmentTagsService.view(page, size, sorter)
            this.setState({dataSource: data, currentPage: page, pageSize: size, loading: false, sorter: sorter})
        }
        
    }

    async componentDidMount(){
        this.getData()
    }

    handlePageChange(changes){
        this.getData(changes.pagination.currentPage, changes.pagination.pageSize, changes.sorter)
    }

    rowSelection = {
        onSelect: (record, selected) => {
            if (selected)
            {
                this.setState(prevState => ({
                        selectedRow: [...prevState.selectedRow, record]
                    })
                )

                this.props.onSelect(record);
            }
            else
                this.setState(prevState => ({
                        selectedRow: [...prevState.selectedRow.filter(el => el.id != record.id)]
                    })
                )
        },
        onSelectAll: (selected, records) => {
            this.setState({...this.state, selectedRow: records})
        }
    }

    showCreate = value => {
        this.setState({...this.state, showCreate: value});
    }

    onCreate = value => {
        this.getData()
    }

    openCard(record){
        history.push(`/equipment/tags/view/${record.id}`)
    }

    render() {
        const columns = [
            { title: 'Наименование', dataIndex: 'name', width: 200, sorter: (a, b) => a.name - b.name > 0 ? 1 : -1},
            { title: '', dataIndex: 'actions', width: 100, render: (text, record, index) => <ButtonOpenCard onClick={this.openCard} record={record} />}
        ];

        return (
            <>
                <Table
                columns={columns}
                dataSource={this.state.dataSource.data}
                loading={this.state.loading}
                resizable
                bordered
                showHeader={true}
                rowKey={'id'}
                title={<Nav
                    header={{text: 'Статусы оборудования'}}
                    style={{padding: 0}}
                    mode={'horizontal'}
                    items={
                            [
                                { itemKey: 'update', text: 'Обновить', icon: <IconRefresh />, onClick: (e) => this.getData() }
                            ]
                        }
                    />}
                rowSelection={this.rowSelection}
                onChange={(changes) => this.handlePageChange(changes)}
                pagination={{
                    currentPage: this.state.currentPage,
                    pageSize: this.state.pageSize,
                    total: this.state.dataSource.totalRecords,
                    showSizeChanger: true
                }}/>
                <ModalCreateManufacturer onClose={this.showCreate} onOk={this.onCreate} show={this.state.showCreate}/>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EquipmentTypeView);
