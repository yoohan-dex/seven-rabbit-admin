import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm, Pagination } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { BackgroundImage } from './share';
import styles from './share.less';

import Form from './components/ProductForm';

@connect(({ list, loading, product }) => ({
  list,
  product,
  loading: loading.models.list,
}))
export default class CardList extends PureComponent {
  state = {
    selectedItem: '',
    page: 1,
    total: 0,
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = (page = 1) => {
    this.setState({ page });
    const { dispatch } = this.props;
    dispatch({
      type: 'product/fetch',
      payload: {
        page,
        size: 8,
      },
    });
  };

  handleEdit = item => () => {
    this.setState({
      selectedItem: item,
    });
    this.props.dispatch({
      type: 'product/toggle',
      payload: true,
    });
  };

  handleAdd = () => {
    this.props.dispatch({
      type: 'product/toggle',
      payload: true,
    });
  };

  handleEdit = item => () => {
    this.setState({
      selectedItem: item,
    });
    this.props.dispatch({
      type: 'product/toggle',
      payload: true,
    });
  };

  handleDelete = id => () => {
    this.props.dispatch({
      type: 'product/del',
      payload: id,
    });
  };

  closeModal = () => {
    this.setState({
      selectedItem: '',
    });
    this.props.dispatch({
      type: 'product/toggle',
      payload: false,
    });
  };

  handlePageChange = page => {
    this.getProducts(page);
  };

  render() {
    const { loading, product } = this.props;
    console.log(product);
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
            current={product.page}
            pageSize={8}
            defaultCurrent={1}
            total={product.total}
          />
        }
        title="产品列表"
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...product.list]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={<BackgroundImage url={item.cover.url} />}
                    actions={actions(item)}
                  />
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" onClick={this.handleAdd} className={styles.newButton}>
                    <Icon type="plus" /> 新增产品
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Form
          visible={product.toggle}
          closeModal={this.closeModal}
          selected={this.state.selectedItem}
        />
      </PageHeaderLayout>
    );
  }
}
