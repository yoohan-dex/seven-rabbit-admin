import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Popconfirm, Pagination, Input } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { BackgroundImage } from './share';
import styles from './share.less';

import Form from './components/TopicForm';

@connect(({ loading, topic }) => ({
  topic,
  loading: false,
}))
export default class TopicCardList extends PureComponent {
  state = {
    selectedItem: '',
    itemOrder: '',
  };

  componentDidMount() {
    this.getTopics();
  }

  getTopics = () => {
    console.log('get topics');
    const { dispatch } = this.props;
    dispatch({
      type: 'topic/fetch',
    });
  };

  handleEdit = item => () => {
    const { dispatch } = this.props;

    this.setState({
      selectedItem: item,
    });
    dispatch({
      type: 'topic/toggle',
      payload: true,
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'topic/toggle',
      payload: true,
    });
  };

  handleEdit = item => () => {
    const { dispatch } = this.props;
    this.setState({
      selectedItem: item,
    });
    dispatch({
      type: 'topic/toggle',
      payload: true,
    });
  };

  handleDelete = id => () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'topic/del',
      payload: id,
    });
  };

  closeModal = () => {
    const { dispatch } = this.props;

    this.setState({
      selectedItem: '',
    });
    dispatch({
      type: 'topic/toggle',
      payload: false,
    });
  };

  handlePageChange = page => {
    this.getTopics(page);
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
    const { dispatch, topic } = this.props;
    const len = topic.topicSort.length;
    const { itemOrder } = this.state;
    if (itemOrder > len || itemOrder < 0) return this.handleItemOrderFinish();
    dispatch({
      type: 'topic/updateTopicSort',
      payload: {
        id,
        order: itemOrder,
      },
    });
    this.handleItemOrderFinish();
  };

  render() {
    const { loading, topic } = this.props;
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
              current={topic.page}
              pageSize={8}
              defaultCurrent={1}
              total={topic.total}
            />
            <br />
          </div>
        }
        title="主题列表"
      >
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...topic.list]}
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
                    <Icon type="plus" /> 新增主题
                  </Button>
                </List.Item>
              )
            }
          />
        </div>
        <Form visible={topic.toggle} closeModal={this.closeModal} selected={selectedItem} />
      </PageHeaderLayout>
    );
  }
}
