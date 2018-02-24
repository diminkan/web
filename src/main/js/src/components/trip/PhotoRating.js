import React, { Component } from 'react';


class PhotoCarousel extends Component {

    onHover(star) {
        this.setState({
            star:star
        });
    }

    onMouseOut() {
        if(!this.state.selected) {
        this.setState({
            star:0
        });
        } else {
            this.setState({
                star: this.state.starSelected
            })
        }
    }

    render() {
        let result = [];

        for(let i = 0 ; i < this.props.rating ;i++) {
            result.push(<span className="fa fa-star checked" onClick={this.props.onRatingChange.bind(this,i+1)} onMouseOut={this.onMouseOut.bind(this)} onMouseOver={this.onHover.bind(this,i+1)}></span>);
        }

        for(let i = this.props.rating ; i < 5 ; i++) {
            result.push(<span className="fa fa-star" onMouseOut={this.onMouseOut.bind(this)} onMouseOver={this.onHover.bind(this,i+1)}></span>);
            
        }

        return result;     
    }

}

export default PhotoCarousel;