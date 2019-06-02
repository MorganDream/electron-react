import React, { Component } from 'react';
import { Layout, Menu, Button } from 'antd';
import { Link } from 'react-router-dom';
import icon from '$public/image/icon.png';
import './index.css';

const { Header } = Layout;
const { Item, SubMenu } = Menu;

class Nav extends Component {

  constructor(props) {
    super(props);
    const hash = location.hash.split('/')[1];
    this.state = { current: hash ? hash : 'Home' };
  }

  handleClick = (e) => {
    this.setState({
      current: e.key
    });
  }

  render() {
    return (
      <div style={{ width: 220, height: '100%' }}>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          selectedKeys={[this.state.current]}
          onClick={this.handleClick}
        >
          <Item key="Home">
            <Link to='/Home'>Home</Link>
          </Item>
          <Item key="Demo">
            <Link to='/Demo'>Demo</Link>
          </Item>
          <Item key="Antd">
            <Link to='/Antd'>Antd</Link>
          </Item>
        </Menu>
      </div>
    );
  }
}

export default Nav;