import React, {Component} from 'react';
import Img from 'react-image';

import './PhotoDialog.css';
import PhotoRating from './PhotoRating';

export default class Photo extends Component {

    constructor(props) {
        super(props);

        this.state = {star : 0 , starSelected : 0, selected: false};
    }

    componentWillMount() {
        this.refreshRatings(this.props);
    }

    componentWillReceiveProps(props) {
        this.refreshRatings(props);
    }

    refreshRatings(props) {
        fetch('http://192.168.1.127:8080/trip/rate?id='+props.selected.id+'&name='+props.name, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            this.setState({rating: data,star:data, loading: false});
        }.bind(this));
    }

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

    onClick(star) {
        this.setState({
            selected: true,
            starSelected: star
        });

        fetch('http://192.168.1.127:8080/trip/rate?id='+this.props.selected.id+'&name='+this.props.name+'&rating=' + star, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            console.log("rated" + response);
        }.bind(this));
    }

    renderStars() {
        let result = [];

        for(let i = 0 ; i < this.state.star ;i++) {
            result.push(<span className="fa fa-star checked" onClick={this.onClick.bind(this,i+1)} onMouseOut={this.onMouseOut.bind(this)} onMouseOver={this.onHover.bind(this,i+1)}></span>);
        }

        for(let i = this.state.star ; i < 5 ; i++) {
            result.push(<span className="fa fa-star" onMouseOut={this.onMouseOut.bind(this)} onMouseOver={this.onHover.bind(this,i+1)}></span>);
            
        }

        return result;       
    }

    onRatingChange(rating) {
        this.setState({
            selected: true,
            rating: rating
        });

        fetch('http://192.168.1.127:8080/trip/rate?id='+this.props.selected.id+'&name='+this.props.name+'&rating=' + rating, {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            console.log("rated" + response);
        }.bind(this));
    }

    render() {
        return <div className="item">
            <Img
                onClick={this
                .props
                .onImageClick
                .bind(this, this.props.src)}
                src={this.props.src}
                style={{height: "225px", width: "100%", display: "block"}}
                loader={< img width = "160" height = "130" src = "http://thinkfuture.com/wp-content/uploads/2013/10/loading_spinner.gif" />}/>
            <span className="caption">
                <PhotoRating rating={this.state.rating} onRatingChange={this.onRatingChange.bind(this)}/>
            </span>
        </div>
    }

}