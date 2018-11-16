import React, { Component } from 'react';
import { Button, Icon, Modal, Form, Input, Upload, Tag } from 'antd';
import { connect } from 'dva';
import * as R from 'ramda';
import styles from './CategoryForm.less';

const FormItem = Form.Item;
const removeExistItems = (l1, l2) => {
  const cmp = (x, y) => x.id === y.id;
  return R.differenceWith(cmp, l1, l2);
};
const UploadButton = ({ loading }) => (
  <div>
    <Icon type={loading ? 'loading' : 'plus'} />
    <div className="ant-upload-text">点击上传</div>
  </div>
);
const FilterTypeTag = ({ onEdit, onSelect, children }) => (
  <div className={styles.filterTypeTag} onClick={onSelect}>
    {children}
    <Icon type="edit" onClick={onEdit} />
  </div>
);

const initialState = {
  selectedId: '',
  // category state
  filterRowTags: [],
  categoryName: '',
  image: '',

  // filter state
  typeName: '',
  filterTags: [],

  inputValue: '',

  uploading: false,
  showInput: false,
  editTag: false,
  addTag: false,
};

@connect(({ category }) => ({ category }))
export default class CategoryForm extends Component {
  static defaultProps = {
    visible: false,
  };
  constructor() {
    super();
    this.state = initialState;
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'category/fetch',
    });
  }
  componentDidUpdate(props) {
    if (!props.visible && this.props.visible) {
      this.initial();
      this.props.dispatch({
        type: 'category/fetch',
      });
    }
    if (props.visible && !this.props.visible) {
      this.reset();
    }
  }
  reset = () => {
    this.setState(initialState);
  }

  initial() {
    const { selected } = this.props;
    if (selected) {
      this.setState({
        ...initialState,
        selectedId: selected.id,
        filterRowTags: selected.filters,
        categoryName: selected.name,
        image: selected.image,
      });
    }
  }

  toggleEdit = e => {
    e.stopPropagation();
    this.setState({
      editTag: true,
    });
  };
  toggleAdd = () => {
    this.setState({
      addTag: true,
    });
  };
  removeToggle = () => {
    this.setState({
      addTag: false,
      editTag: false,
    });
  };
  showInput = () => {
    this.setState(
      {
        showInput: true,
      },
      () => this.input.focus()
    );
  };
  handleInput = type => e => {
    this.setState({
      [type]: e.target.value,
    });
  };
  removeInput = i => () => {
    const newFilterTags = [].concat(this.state.filterTags);
    newFilterTags.splice(i, 1);
    this.setState({
      filterTags: newFilterTags,
    });
  };
  handleInputConfirm = () => {
    if (this.state.inputValue) {
      this.setState({
        filterTags: [...this.state.filterTags, { name: this.state.inputValue }],
        inputValue: '',
        showInput: false,
      });
    } else {
      this.setState({
        showInput: false,
      });
    }
  };
  saveInputRef = input => {
    this.input = input;
  };
  handleCategorySelect = item => () => {
    this.setState({
      filterRowTags: [...this.state.filterRowTags, item],
    });
  };
  removeCategorySelect = idx => () => {
    const newFilterTags = [].concat(this.state.filterRowTags);
    newFilterTags.splice(idx, 1);
    this.setState({
      filterRowTags: newFilterTags,
    });
  };
  handleUploadChange = info => {
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      const image = info.fileList[0].response;
      this.setState({ image });
    }
  };
  handleFilterSubmit = () => {
    const data = {
      name: this.state.typeName,
      features: this.state.filterTags,
    };
    this.props.dispatch({
      type: 'category/add',
      payload: data,
    });
  };
  handleCategorySubmit = () => {
    const { selectedId, categoryName, image, filterRowTags } = this.state;
    const data = {
      id: selectedId,
      name: categoryName,
      image: image.id,
      filters: filterRowTags.map(tag => tag.id),
    };
    if (selectedId) {
      this.props.dispatch({
        type: 'category/modOne',
        payload: data,
      });
    } else {
      this.props.dispatch({
        type: 'category/submit',
        payload: data,
      });
    }
  };
  render() {
    const { visible, closeModal, category } = this.props;
    const {
      categoryName,
      uploading,
      image,
      editTag,
      addTag,
      filterTags,
      showInput,
      inputValue,
      typeName,
      filterRowTags,
    } = this.state;
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

    const withoutLabelLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16, offset: 4 },
      },
    };
    const formItemLayout2 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Modal
        visible={visible}
        onCancel={closeModal}
        maskClosable={false}
        title="添加分类"
        width="70%"
        okText="提交"
        cancelText="取消"
        onOk={this.handleCategorySubmit}        
      >
        <Form>
          <FormItem {...formItemLayout} label="分类名">
            <Input
              placeholder="分类名"
              value={categoryName}
              onChange={this.handleInput('categoryName')}
            />
          </FormItem>

          <FormItem {...formItemLayout} label="分类封面">
            <Upload
              className="avatar-uploader"
              onChange={this.handleUploadChange}
              listType="picture-card"
              showUploadList={false}
              action="https://www.hotbody.wang/common/upload"
              // action="http://localhost:3000/common/upload"
            >
              {image.url ? (
                <img src={image.url} alt="avatar" />
              ) : (
                <UploadButton loading={uploading} />
              )}
            </Upload>
          </FormItem>

          <FormItem {...formItemLayout} label="筛选项">
            <div>
              {filterRowTags.map((tag, i) => (
                <Tag closable onClose={this.removeCategorySelect(i)} key={tag.id}>
                  {tag.name}
                </Tag>
              ))}
            </div>
            <div>
              {removeExistItems(category.list, filterRowTags).map(c => (
                <FilterTypeTag
                  onSelect={this.handleCategorySelect(c)}
                  onEdit={this.toggleEdit}
                  key={c.id}
                >
                  {c.name}
                </FilterTypeTag>
              ))}
            </div>
          </FormItem>
          <FormItem {...withoutLabelLayout}>
            <hr style={{ border: '0.5px solid #eee' }} />
          </FormItem>
          <FormItem {...withoutLabelLayout}>
            {!(addTag || editTag) ? (
              <Button type="dashed" onClick={this.toggleAdd} style={{ width: '100%' }}>
                添加筛选项
              </Button>
            ) : (
              <div className={styles.formBox}>
                <div className={styles.formContent}>
                  <FormItem {...formItemLayout2} label="筛选类别">
                    <Input value={typeName} onChange={this.handleInput('typeName')} />
                  </FormItem>
                  <FormItem {...formItemLayout2} label="增加特征">
                    {filterTags.map((tag, idx) => {
                      return (
                        <Tag key={tag.name} closable afterClose={this.removeInput(idx)}>
                          {tag.name}
                        </Tag>
                      );
                    })}
                    {showInput && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInput('inputValue')}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!showInput && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: '#fff', borderStyle: 'dashed' }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </FormItem>
                  <div className={styles.gotoRight}>
                    <Button type="primary" onClick={this.handleFilterSubmit}>
                      确定
                    </Button>
                  </div>
                </div>
                <Icon type="close" onClick={this.removeToggle} />
              </div>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
