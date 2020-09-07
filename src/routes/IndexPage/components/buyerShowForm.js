import React, { Component } from 'react';
import { Button, Icon, Modal, Form, Input, Upload, Switch } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const initialState = {
  selectedId: '',
  name: '',
  detail: [],
  videoUrl: '',
  // false: 'image' true: 'video'
  type: false,

  uploading: false,
  show: false,
};

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

@connect(({ buyerShow }) => ({ buyerShow }))
export default class BuyerShowForm extends Component {
  static defaultProps = {
    visible: false,
  };

  constructor() {
    super();
    this.state = initialState;
  }

  componentDidUpdate(props) {
    const { visible } = this.props;

    if (!props.visible && visible) {
      this.initial();
      this.handleShow(true);
    }
    if (props.visible && !visible) {
      this.reset();
      this.handleShow(false);
    }
  }

  reset = () => {
    this.setState(initialState);
  };

  initial = () => {
    const { selected } = this.props;
    if (selected) {
      this.setState({
        ...initialState,
        selectedId: selected.id,
        name: selected.name,
        type: selected.type === 'video',
        videoUrl: selected.videoUrl,
        detail: selected.detail.map(d => ({ ...d, uid: d.id })),
      });
    }
  };

  handleShow = show => {
    this.setState({ show });
  };

  handleName = e => {
    this.setState({
      name: e.target.value,
    });
  };

  handleVideoUrl = e => {
    this.setState({
      videoUrl: e.target.value,
    });
  };

  handleDetailChange = info => {
    const { state } = this;
    if (info.file.status === 'done') {
      const detail = [...state.detail];
      detail.push(...info.fileList.map(f => f.response).filter(v => v));
      this.setState({ detail });
    }
  };

  handleDetailRemove = info => {
    const { state } = this;

    let target;
    if (info.response) {
      // target = info.response.idtarget;
      target = info.response.id;
    } else {
      target = info.id;
    }
    const detail = state.detail.filter(d => d.id !== target);
    this.setState({ detail });
  };

  handleToggleType = type => {
    this.setState({
      type,
    });
  };

  handleSubmit = () => {
    const { name, detail, selectedId, videoUrl, type } = this.state;
    const { dispatch } = this.props;

    const payload = {
      id: selectedId,
      name,
      detail: detail.map(d => d.id),
      videoUrl,
      type: type ? 'video' : 'image',
    };
    if (selectedId) {
      dispatch({
        type: 'buyerShow/modOne',
        payload,
      });
    } else {
      dispatch({
        type: 'buyerShow/post',
        payload,
      });
    }
  };

  render() {
    const { visible, closeModal } = this.props;
    const { state } = this;
    const { name, detail, show, type, videoUrl } = state;
    return (
      <Modal
        visible={visible}
        onCancel={closeModal}
        maskClosable={false}
        okText="提交"
        cancelText="取消"
        title="添加产品"
        width="70%"
        onOk={this.handleSubmit}
      >
        {show ? (
          <Form>
            <FormItem {...formItemLayout} label="名称">
              <Input placeholder="名称" value={name} onChange={this.handleName} />
            </FormItem>
            <FormItem {...formItemLayout} label="类型">
              <Switch
                checkedChildren="视"
                unCheckedChildren="图"
                onChange={this.handleToggleType}
                defaultChecked={type}
              />
            </FormItem>
            <FormItem {...formItemLayout} label="图片">
              <Upload
                onChange={this.handleDetailChange}
                listType="picture"
                multiple
                defaultFileList={detail}
                onRemove={this.handleDetailRemove}
                action="https://www.sevenrabbit.cn/common/upload"
                // action="http://localhost:3000/common/upload"
              >
                <Button>
                  <Icon type="upload" /> 上传
                </Button>
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="路径">
              <Input placeholder="url" value={videoUrl} onChange={this.handleVideoUrl} />
            </FormItem>
          </Form>
        ) : (
          ''
        )}
      </Modal>
    );
  }
}
