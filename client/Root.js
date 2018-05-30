import React from 'react'
import axios from 'axios'

class Root extends React.Component {
  constructor() {
    super()
    this.state = {
      foo: '',
      bar: '',
    }
  }
  async componentDidMount() {
    const { data } = await axios.get('/some-data')
    this.setState(data)
  }
  render() {
    return (
      <div>
        <ul>
          <li>{this.state.foo}</li>
          <li>{this.state.biz}</li>
        </ul>
      </div>
    )
  }
}

export default Root
