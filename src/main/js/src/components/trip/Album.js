import React, {Component} from 'react';
import {Pagination, PaginationItem, PaginationLink} from 'reactstrap';
import Photo from './Photo';
import PhotoCarousel from './PhotoCarousel';
export default class Album extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      page: 1
    };

  }

  componentWillMount() {
    fetch('http://192.168.1.127:8080/files?path=' + this.props.selected.path, {
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
        this.setState({fileNames: data, loading: false});
      }.bind(this));
  }

  onImageClick(src) {
    window.open(src);
  }

  onNext() {
    this.setState({
      page: this.state.page + 1
    });
  }

  onPrevious() {
    this.setState({
      page: this.state.page - 1
    });
  }

  render() {
    const start = (this.state.page - 1) * 9;
    const end = (this.state.page) * 9;
    let items = [];

    if (!this.state.loading) {
    this
                .state
                .fileNames
                .slice(start, end)
                .forEach(file => {
                  const src = "http://192.168.1.127:8080/file?path=" + this.props.selected.path + "&name=" + file;
                  items.push({src: src, altText:"slide", caption:file});
                });
              }
    return this.state.loading
      ? <span>Loading...</span>
      : <div>
        
        <div className="row justify-content-center">
        <PhotoCarousel items={items}/>
        </div>
        <div className="album py-5 bg-light">
          <div className="container">

            <div className="row">
              {this
                .state
                .fileNames
                .slice(start, end)
                .map(file => {
                  const src = "http://192.168.1.127:8080/file?path=" + this.props.selected.path + "&name=" + file;
                  return <div className="col-md-4">
                    <div className="card mb-4 box-shadow">
                      <Photo
                        src={src}
                        name={file}
                        selected={this.props.selected}
                        onImageClick={this
                        .onImageClick
                        .bind(this)}></Photo>
                      {/* <img className="card-img-top" data-src="holder.js/100px225?theme=thumb&amp;bg=55595c&amp;fg=eceeef&amp;text=Thumbnail" alt="Thumbnail [100%x225]" src={src} data-holder-rendered="true" style={{height: "225px", width: "100%", display: "block"}}/> */}
                      <div className="card-body">
                        <p className="card-text">This is a wider card with supporting text below as a
                          natural lead-in to additional content. This content is a little bit longer.</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="btn-group">
                            <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                            <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
                          </div>
                          <small className="text-muted">9 mins</small>
                        </div>
                      </div>
                    </div>
                  </div>
                })}

            </div>
            <div className="row justify-content-center">
              <Pagination>
                <PaginationItem>
                  <PaginationLink
                    previous
                    onClick={this
                    .onPrevious
                    .bind(this)}/>
                </PaginationItem>

                <PaginationItem>
                  <PaginationLink href="#">
                    {this.state.page}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    next
                    onClick={this
                    .onNext
                    .bind(this)}/>
                </PaginationItem>
              </Pagination>
            </div>
          </div>
        </div>
        <div></div>

      </div>
  }

}