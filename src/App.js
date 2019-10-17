
import React, { Component, Fragment } from 'react'
import Users from './Users'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import AuthorizedUser from './AuthorizedUser'
import Photos from './Photos'
import PostPhoto from './PostPhoto'
import { gql } from 'apollo-boost'
import { withApollo } from 'react-apollo'

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos 
    allUsers {...userInfo}
    me {...userInfo}
    allPhotos {
      id
      name
      url
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`
const App = () => 
<BrowserRouter>
<Switch>
    <Route exact path="/" component={() =>
        <Fragment>
            <AuthorizedUser />
            <Users />
            <Photos />
        </Fragment>
    } />
    <Route path="/newPhoto" component={PostPhoto} />
    <Route component={({ location }) => <h1>"{location.pathname}" not found</h1>} />
</Switch>
</BrowserRouter>  


export default App;
