import * as React from 'react';
import { gql, graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

export interface Category {
  id: string;
  name: string;
}

interface Props {
  data: {
    categories: Category[];
  };
}

const categoryQuery = gql`
  query allCategories {
    categories {
      id
      name
    }
  }
`;

@graphql(categoryQuery)
export default class Categories extends React.PureComponent<Props, {}> {
  render() {
    const categories = this.props.data.categories || [];
    return (
      <div>
        <h1>Categories</h1>
        <div className="card-list">
          {
            categories.map(category => (
              <div key={category.id} className="card-list__item">
                <Link to={`/categories/${category.id}`} className="card-list__item-title">{category.name}</Link>
              </div>
            ))
          }
        </div>
      </div>
    );
  }
}
