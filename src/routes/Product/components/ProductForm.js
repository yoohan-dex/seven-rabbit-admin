import React, { Component } from 'react';
import { Button, Icon, Modal, Form, Input, Upload, Tag, Select, Switch } from 'antd';
import { connect } from 'dva';
import styles from './ProductForm.less';

const FormItem = Form.Item;
const { Option } = Select;
const { CheckableTag } = Tag;
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
  detail: [],
  features: [],
  category: '',
  hot: false,
  hotType: '',

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

@connect(({ product, category }) => ({ product, category }))
export default class ProductForm extends Component {
  static defaultProps = {
    visible: false,
  };

  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'category/fetchCategory',
    });
    dispatch({
      type: 'category/fetch',
    });
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
        category: selected.category.id,
        cover: selected.cover,
        hot: selected.hot,
        name: selected.name,
        hotType: selected.hotType,
        detail: selected.detail.map(d => ({ ...d, uid: d.id })),
        features: selected.features.map(f => f.id),
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

  handleCategoryChange = value => {
    this.setState({
      category: value,
    });
  };

  handleCoverChange = info => {
    if (info.file.status === 'done') {
      const cover = info.fileList[0].response;
      this.setState({ cover });
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
    const { name, category, cover, detail, features, selectedId, hot, hotType } = this.state;
    const payload = {
      id: selectedId,
      name,
      hot,
      category,
      hotType,
      cover: cover.id,
      detail: detail.map(d => d.id),
      features,
    };
    if (selectedId) {
      dispatch({
        type: 'product/modOne',
        payload,
      });
    } else {
      dispatch({
        type: 'product/post',
        payload,
      });
    }
  };

  handleHotChange = bool => {
    this.setState({
      hot: bool,
    });
  };

  handleHotType = value => {
    this.setState({
      hotType: parseInt(value, 10),
    });
  };

  render() {
    const { visible, closeModal, category } = this.props;
    const {
      name,
      features,
      cover,
      detail,
      uploading,
      show,
      hot,
      category: cty,
      hotType,
    } = this.state;
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

            <FormItem {...formItemLayout} label="爆品">
              <Switch checked={hot} onChange={this.handleHotChange} />
            </FormItem>

            <FormItem {...formItemLayout} label="爆品类型">
              <Select onChange={this.handleHotType} value={hotType}>
                <Select.Option value={1}>春款</Select.Option>
                <Select.Option value={2}>夏款</Select.Option>
                <Select.Option value={3}>秋款</Select.Option>
                <Select.Option value={4}>冬款</Select.Option>
                <Select.Option value={5}>周边</Select.Option>
                <Select.Option value={6}>精品</Select.Option>
              </Select>
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
            <FormItem {...formItemLayout} label="类别">
              {category.categories.length > 0 ? (
                <Select
                  defaultValue={cty || ''}
                  style={{ width: 200 }}
                  onChange={this.handleCategoryChange}
                >
                  {category.categories.map(c => (
                    <Option value={c.id} key={c.id}>
                      {c.name}
                    </Option>
                  ))}
                </Select>
              ) : (
                ''
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="特性">
              {category.list.map(f => (
                <div key={f.id}>
                  <p className={styles.filter}>{f.name}</p>
                  {f.features.map(feature => (
                    <CheckableTag
                      key={feature.id}
                      checked={features.includes(feature.id)}
                      onChange={this.handleTagCheck(feature.id)}
                    >
                      {feature.name}
                    </CheckableTag>
                  ))}
                </div>
              ))}
            </FormItem>
          </Form>
        ) : (
          ''
        )}
      </Modal>
    );
  }
}
