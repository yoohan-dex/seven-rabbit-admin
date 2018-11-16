import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import Form from './components/CategoryForm';
import { BackgroundImage } from './share';
import styles from './share.less';

@connect(({ category, loading }) => ({
  category,
  loading: loading.models.list,
}))
export default class CardList extends PureComponent {
  state = {
    selectedItem: '',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'category/fetchCategory',
      payload: {
        page: 20,
      },
    });
  }
  handleEdit = item => () => {
    this.setState({
      selectedItem: item,
    });
    this.props.dispatch({
      type: 'category/toggle',
      payload: true,
    });
  };
  handleAdd = () => {
    this.props.dispatch({
      type: 'category/toggle',
      payload: true,
    });
  };
  handleDelete = id => () => {
    this.props.dispatch({
      type: 'category/del',
      payload: id,
    });
  };
  closeModal = () => {
    this.setState({
      selectedItem: '',
    });
    this.props.dispatch({
      type: 'category/toggle',
      payload: false,
    });
  };
  render() {
    const { category, loading } = this.props;

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
      <PageHeaderLayout title="分类列表">
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...category.categories]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    cover={<BackgroundImage url={item.image.url} />}
                    actions={actions(item)}
                  />
                </List.Item>
              ) : (
                <List.Item>
                  <Button type="dashed" onClick={this.handleAdd} className={styles.newButton}>
                    <Icon type="plus" /> 新增分类
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Form
          visible={category.toggle}
          closeModal={this.closeModal}
          selected={this.state.selectedItem}
        />
      </PageHeaderLayout>
    );
  }
}
