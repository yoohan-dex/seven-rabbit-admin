import React, { Component } from 'react';
import { Button, Icon, Modal, Form, Upload, Input } from 'antd';
import { connect } from 'dva';
import './TopicForm.less';

const FormItem = Form.Item;
const UploadButton = ({ loading }) => (
  <div>
    <Icon type={loading ? 'loading' : 'plus'} />
    <div className="ant-upload-text">点击上传</div>
  </div>
);
const initialState = {
  selectedId: '',
  name: '',
  cover: '',
  background: '',
  detail: [],
  features: [],
  hot: false,
  title: '',

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

@connect(({ topic }) => ({ topic }))
export default class TopicForm extends Component {
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
        cover: selected.cover,
        background: selected.background,
        hot: selected.hot,
        title: selected.title,
        detail: selected.detail.map(d => ({ ...d, uid: d.id })),
      });
    }
  };

  handleShow = show => {
    this.setState({ show });
  };

  handleTitle = e => {
    this.setState({
      title: e.target.value,
    });
  };

  handleCoverChange = info => {
    if (info.file.status === 'done') {
      const cover = info.fileList[0].response;
      this.setState({ cover });
    }
  };

  handleBackgroundChange = info => {
    if (info.file.status === 'done') {
      const background = info.fileList[0].response;
      this.setState({ background });
    }
  };

  handleDetailChange = info => {
    const { detail: d } = this.state;
    if (info.file.status === 'done') {
      const detail = [...d];
      detail.push(...info.fileList.map(f => f.response).filter(v => v));
      this.setState({ detail });
    }
  };

  handleDetailRemove = info => {
    const { detail: dt } = this.state;
    let target;
    if (info.response) {
      target = info.response.idtarget;
    } else {
      target = info.id;
    }
    const detail = dt.filter(d => d.id !== target);
    this.setState({ detail });
  };

  handleTagCheck = id => () => {
    const { features } = this.state;
    if (features.includes(id)) {
      this.setState({
        features: features.filter(f => f !== id),
      });
    } else {
      this.setState({
        features: [...features, id],
      });
    }
  };

  handleSubmit = () => {
    const { dispatch } = this.props;
    const { name, cover, detail, features, selectedId, hot, title, background } = this.state;
    const payload = {
      id: selectedId,
      title,
      name,
      hot,
      background: background.id,
      cover: cover.id,
      detail: detail.map(d => d.id),
      features,
    };
    if (selectedId) {
      dispatch({
        type: 'topic/modOne',
        payload,
      });
    } else {
      dispatch({
        type: 'topic/post',
        payload,
      });
    }
  };

  handleHotChange = bool => {
    this.setState({
      hot: bool,
    });
  };

  render() {
    const { visible, closeModal } = this.props;
    const { cover, detail, uploading, show, title, background } = this.state;
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
              <Input placeholder="名称" value={title} onChange={this.handleTitle} />
            </FormItem>
            <FormItem {...formItemLayout} label="封面">
              <Upload
                className="avatar-uploader"
                onChange={this.handleCoverChange}
                listType="picture-card"
                showUploadList={false}
                action="https://www.sevenrabbit.cn/common/upload"
                // action="http://localhost:3000/common/upload"
              >
                {cover.url ? (
                  <img src={cover.url} alt="avatar" />
                ) : (
                  <UploadButton loading={uploading} />
                )}
              </Upload>
            </FormItem>
            <FormItem {...formItemLayout} label="背景">
              <Upload
                className="avatar-uploader"
                onChange={this.handleBackgroundChange}
                listType="picture-card"
                showUploadList={false}
                action="https://www.sevenrabbit.cn/common/upload"
                // action="http://localhost:3000/common/upload"
              >
                {background && background.url ? (
                  <img src={background.url} alt="avatar" />
                ) : (
                  <UploadButton loading={uploading} />
                )}
              </Upload>
            </FormItem>

            <FormItem {...formItemLayout} label="详情图片">
              <Upload
                onChange={this.handleDetailChange}
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
          </Form>
        ) : (
          ''
        )}
      </Modal>
    );
  }
}
