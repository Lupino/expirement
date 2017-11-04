import React, {Component} from 'react';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

export default class Pagenav extends Component {
  constructor(props) {
    super(props);
  }
  static propTypes = {
    from: PropTypes.number,
    size: PropTypes.number,
    total: PropTypes.number,
    onClick: PropTypes.func
  }
  handleClick(page) {
    if ( this.props.onClick ) {
      this.props.onClick((page - 1) * this.props.size);
    }
  }
  render() {
    const { from, total, size } = this.props;
    const totalPage = Math.ceil(total / size);
    const currentPage = Math.ceil(from / size) + 1;

    if (totalPage <= 1) {
      return <span></span>;
    }

    let links = [];
    links.push({ icon: 'home', label: '首页', index: 1 });
    if (currentPage > 1) {
      links.push({ label: '上一页',
        index: currentPage - 1 });
    }

    let start = currentPage - 3;
    if (start < 1) start = 1;

    for (let i = start; i < currentPage; i ++) {
      links.push({ label: i + '', index: i });
    }

    links.push({ label: currentPage + '', index: currentPage });

    let end = currentPage + 3;
    if (end > totalPage) end = totalPage;

    for (let i = currentPage + 1; i <= end; i ++) {
      links.push({ label: i + '', index: i });
    }

    let next = currentPage + 1;
    if (next <= totalPage) {
      links.push({ label: '下一页', index: next});
    }

    links.push({ label: '末页', index: totalPage});

    links = links.map((link) => {
      const { index, label } = link;
      return <FlatButton label={label} style={{minWidth: 10}}
        onClick={this.handleClick.bind(this, index)}
        key={label}
        disabled={index === currentPage}
        labelStyle={{paddingLeft: 8, paddingRight: 8}}
      />;
    });
    return (
      <div>
        {links}
      </div>
    );
  }
}
