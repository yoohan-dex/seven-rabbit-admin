import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm, Pagination } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { BackgroundImage } from './share';
import styles from './share.less';

import Form from './components/buyerShowForm';

@connect(({ loading, buyerShow }) => ({
  buyerShow,
  loading: loading.models.buyerShow,
}))
export default class CardList extends PureComponent {
  state = {
    selectedItem: '',
  };

  componentDidMount() {
    this.getList();
  }

  getList = (page = 1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'buyerShow/fetch',
      payload: {
        page,
        size: 8,
        type: 'video',
      },
    });
  };

  handleEdit = item => () => {
    const { dispatch } = this.props;

    this.setState({
      selectedItem: item,
    });
    dispatch({
      type: 'buyerShow/toggle',
      payload: true,
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'buyerShow/toggle',
      payload: true,
    });
  };

  handleEdit = item => () => {
    const { dispatch } = this.props;
    this.setState({
      selectedItem: item,
    });
    dispatch({
      type: 'buyerShow/toggle',
      payload: true,
    });
  };

  handleDelete = id => () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'buyerShow/del',
      payload: id,
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;

    this.setState({
      selectedItem: '',
    });
    dispatch({
      type: 'buyerShow/toggle',
      payload: false,
    });
  };

  handlePageChange = page => {
    this.getList(page);
  };

  render() {
    const { loading, buyerShow } = this.props;
    const { selectedItem } = this.state;
    const actions = item => [
      <a onClick={this.handleEdit(item)}>编辑</a>,
      <Popconfirm
        placement="topLeft"
        title="确定删除吗？"
        onConfirm={this.handleDelete(item.id)}
        okText="确定"
        cancelText="点错了"
      >
        <a>删除</a>
      </Popconfirm>,
    ];

    return (
      <PageHeaderLayout
        content={
          <Pagination
            onChange={this.handlePageChange}
            current={buyerShow.page}
            pageSize={8}
            defaultCurrent={1}
            total={buyerShow.total}
          />
        }
        title="买家秀列表"
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...buyerShow.list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={<BackgroundImage url={item.cover && item.cover.url} />}
                    actions={actions(item)}
                  />
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" onClick={this.handleAdd} className={styles.newButton}>
                    <Icon type="plus" /> 新增买家秀
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Form visible={buyerShow.toggle} closeModal={this.closeModal} selected={selectedItem} />
      </PageHeaderLayout>
    );
  }
}
