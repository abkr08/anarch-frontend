import React, { Component } from "react";
import "./Button.css"
class Button extends Component {
  handleClick = () => {
    this.props.onClick();
  };

  render() {
    return (
      <button className="btn btn-primary" type="button" style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)' }} onClick={this.handleClick}>
        {this.props.label}
      </button>
    );
  }
}
export default Button;
