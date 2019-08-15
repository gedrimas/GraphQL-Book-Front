import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Mutation, Query } from 'react-apollo'
import { gql } from 'apollo-boost'
import { ROOT_QUERY } from './App'

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String){
    githubAuth(code:$code) { token }
  }
`
const Me =({ logout, requestCode, signinIn }) => 
  <Query query={ROOT_QUERY}>
    {
      ({ loading, data }) => data.me ?
      <CurrentUser {...data.me} logout={logout} /> :
      loading ? <p>loading...</p> :
      <button 
        onClick={requestCode}
        disabled={signinIn}>
          Sign in with GitHub
        </button> 
    }
  </Query>

  const CurrentUser = ({ name, avatar, logout }) => 
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      <h1>{name}</h1>
      <button onClick={logout}>logout</button>
    </div>

class AuthorizedUser extends Component {
  state = { signinIn: false }

  authorizationComplete = (cache, { data }) => {
    localStorage.setItem('token', data.githubAuth.token)
    this.props.history.replace('/')
    this.setState({signinIn: false})
  }
  
  componentDidMount(){
    if(window.location.search.match(/code=/)) {
      this.setState({ signinIn: true })
      const code = window.location.search.replace("?code=", "")
      console.log('111111111111111111111', code)
      this.githubAuth({ variables: {code} })
    }
  }

  requestCode(){
    var clientID = 'f11f25343ebc49580244'
    //console.log(window.location)
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
  }

  render() {
    return(
      <Mutation 
        mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refetchQueries={[{query: ROOT_QUERY}]}
      >
        {mutation => {
          this.githubAuth = mutation
          return (
            <Me signinIn={this.state.signinIn}
              requestCode={this.requestCode}
              logout={() => localStorage.removeItem('token')} />
            )
          }
        }
      </Mutation>
    )
  }
}

export default withRouter(AuthorizedUser)
