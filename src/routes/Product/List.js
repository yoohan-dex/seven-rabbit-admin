import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm, Pagination, Input, Switch, Select } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { BackgroundImage } from './share';
import styles from './share.less';

import Form from './components/ProductForm';

@connect(({ loading, product }) => ({
  product,
  loading: loading.models.product,
}))
export default class CardList extends PureComponent {
  state = {
    selectedItem: '',
    itemOrder: '',
  };

  componentDidMount() {
    this.getProducts();
  }

  getProducts = (page = 1) => {
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
    const { dispatch } = this.props;

    this.setState({
      selectedItem: item,
    });
    dispatch({
      type: 'product/toggle',
      payload: true,
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/toggle',
      payload: true,
    });
  };

  handleEdit = item => () => {
    const { dispatch } = this.props;
    this.setState({
      selectedItem: item,
    });
    dispatch({
      type: 'product/toggle',
      payload: true,
    });
  };

  handleDelete = id => () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/del',
      payload: id,
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;

    this.setState({
      selectedItem: '',
    });
    dispatch({
      type: 'product/toggle',
      payload: false,
    });
  };

  handlePageChange = page => {
    this.getProducts(page);
  };

  handleClickCard = (e, id) => {
    console.log('e', e);
    console.log('id', id);
  };

  handleItemOrderChange = e => {
    const { value } = e.target;
    if (!value) return;
    this.setState({
      itemOrder: parseInt(value, 10),
    });
  };

  handleItemOrderFinish = () => {
    this.setState({
      itemOrder: '',
    });
  };

  handleItemOrderConfirm = id => () => {
    const { dispatch, product } = this.props;
    const len = product.hotSort.length;
    const { itemOrder } = this.state;
    if (itemOrder > len || itemOrder < 0) return this.handleItemOrderFinish();
    dispatch({
      type: 'product/updateHotSort',
      payload: {
        id,
        order: itemOrder,
      },
    });
    this.handleItemOrderFinish();
  };

  handleToggleHot = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'product/toggleHot' });
    dispatch({ type: 'product/fetchCurrent' });
  };

  handleHotTypeChange = value => {
    const { dispatch } = this.props;
    dispatch({ type: 'product/changeHotType', payload: { hotType: value } });
    dispatch({ type: 'product/fetchCurrent' });
  };

  render() {
    const { loading, product } = this.props;
    const { selectedItem, itemOrder } = this.state;
    const actions = item => {
      const btns = [
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
      if (item.hot) {
        btns.push(
          <Popconfirm
            placement="topLeft"
            icon={<i />}
            onConfirm={this.handleItemOrderConfirm(item.id)}
            onCancel={this.handleItemOrderFinish}
            title={<Input value={itemOrder} type="number" onChange={this.handleItemOrderChange} />}
          >
            <Icon type="ellipsis" />
          </Popconfirm>
        );
      }
      return btns;
    };

    return (
      <PageHeaderLayout
        content={
          <div>
            <Pagination
              onChange={this.handlePageChange}
              current={product.page}
              pageSize={8}
              defaultCurrent={1}
              total={product.total}
            />
            <br />
            <Switch
              checkedChildren="爆"
              unCheckedChildren="爆"
              onChange={this.handleToggleHot}
              defaultChecked={product.hot}
            />
            <br />
            <Select onChange={this.handleHotTypeChange} value={product.hotType}>
              <Select.Option value={1}>春款</Select.Option>
              <Select.Option value={2}>夏款</Select.Option>
              <Select.Option value={3}>秋款</Select.Option>
              <Select.Option value={4}>冬款</Select.Option>
              <Select.Option value={5}>周边</Select.Option>
              <Select.Option value={6}>精品</Select.Option>
            </Select>
          </div>
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
        <Form visible={product.toggle} closeModal={this.closeModal} selected={selectedItem} />
      </PageHeaderLayout>
    );
  }
}
