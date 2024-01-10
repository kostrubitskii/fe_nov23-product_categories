/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const getPreparedProducts = (products, query, selectedUser) => {
  let preparedProducts = [...products];
  const normalQuery = query.toLowerCase().trim();

  if (query) {
    preparedProducts = preparedProducts.filter(
      product => product.name.toLowerCase().includes(normalQuery),
    );
  }

  if (selectedUser && selectedUser !== 'All') {
    preparedProducts = preparedProducts.filter(
      product => product.user === selectedUser,
    );
  }

  return preparedProducts;
};

const getCategoryIcon = (categoryId) => {
  const category = categoriesFromServer.find(cat => cat.id === categoryId);

  return category ? category.icon : '';
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState('All');
  const visibleProducts = getPreparedProducts(productsFromServer, query);
  const [activeCategory, setActiveCategory] = useState('');
  const UserFilter = (user) => {
    setSelectedUser(user);
  };

  const CategoryClick = (category) => {
    setActiveCategory(category.id);
  };

  const clearFilters = () => {
    setQuery('');
    setSelectedUser('All');
    setActiveCategory('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => UserFilter('All')}
                className={selectedUser === 'All' ? 'is-active' : ''}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => UserFilter(user.name)}
                  className={selectedUser === user.name ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  onChange={(event) => {
                    setQuery(event.currentTarget.value);
                  }}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                />

                {query && (
                  <span className="icon is-right">
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${activeCategory === category.id ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => CategoryClick(category)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map(product => (
                <tr data-cy="Product" key={product.id}>
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {`${getCategoryIcon(product.categoryId)} - ${
                      categoriesFromServer.find(
                        category => category.id === product.categoryId,
                      )?.title || ''
                    }`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className="has-text-link"
                  >
                    {/* {usersFromServer.name} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
