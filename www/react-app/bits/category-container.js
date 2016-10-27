import React from 'react';
import axios from 'axios';
import Category from './category';

class CategoryContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category: {
        cards: [],
      },
    };
  }

  componentDidMount() {
    axios.get(`/api/categories/${this.props.params.catslug}`)
      .then(res => {
        if (res.data.status === 'success') {
          this.setState({ category: res.data.data });
        }
      });
  }

  render() {
    return (
      <Category category={this.state.category} />

    );
  }

}

CategoryContainer.propTypes = {
  params: React.PropTypes.object,
};

CategoryContainer.defaultProps = {

};

export default CategoryContainer;
