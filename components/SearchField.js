import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import PropTypes from 'prop-types';

export default class SearchField extends Component {
  static propTypes = {
    onSearch: PropTypes.func,
    hintText: PropTypes.string,
    query: PropTypes.string,
  }
  constructor(props) {
    super(props);
    this.state = {
      query: props.query
    };
  }
  handleChange(evt, query) {
    this.setState({ query });
  }
  handleSearch() {
    this.props.onSearch(this.state.query);
  }
  handleKeyPress(event) {
    if (event.nativeEvent.keyCode === 13) {
      this.handleSearch();
    }
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { hintText, onSearch, query: noop, ...other } = this.props;
    /* eslint-enable no-unused-vars */
    const { query } = this.state;
    return (
      <div {...other} style={{ position: 'relative', display: 'inline-block' }}>
        <TextField
          hintText={hintText}
          name='query'
          value={query}
          onChange={this.handleChange.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
        />
        <IconButton icon='search' className='search-btn'
          style={{position: 'absolute', top: 0, right: -13}}
          onClick={this.handleSearch.bind(this)}>
          <ActionSearch />
        </IconButton>
      </div>
    );
  }
}
