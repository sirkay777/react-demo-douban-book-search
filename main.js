let React = require('react');
let ReactDom = require('react-dom');

class Logo extends React.Component{
  render(){
    return (
      <div className="logo">
        <img src="https://img3.doubanio.com/f/shire/8308f83ca66946299fc80efb1f10ea21f99ec2a5/pics/nav/lg_main_a11_1.png"/>
      </div>
    );
  }
}

class SearchBox extends React.Component{
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  render(){
    return (
      <div>
        <input
          className="search-box"
          type="text"
          placeholder="请输入搜索关键词"
          value={this.props.keyword}
          ref="KeywordTextInput"
          onChange={this.handleChange}/>
        <input
          className="filter"
          type="checkbox"
          checked={this.props.highRatingOnly}
          ref="highRatingOnlyInput"
          onChange={this.handleChange}/>
          <label>只显示8星以上</label>
      </div>
    );
  }
  handleChange(){
    this.props.onUserInput(
      this.refs.KeywordTextInput.value,
      this.refs.highRatingOnlyInput.checked
    );
  }
}

class BookList extends React.Component{
  render(){
    let books = this.props.books.filter((book)=>{
      if(this.props.highRatingOnly && book.rating.average < 8.0){
        return false;
      }
      return true;
    }).map((book) => {
      return (
        <li key={book.id}>
          <a href={book.alt} target="_blank"><img src={book.image}/></a>
          <p>{book.title}</p>
          <p>{book.author}</p>
          <p>{book.rating.average}</p>
        </li>
      );
    });
    return (
      <ul className="book-list">
        {books}
      </ul>
    );
  }
}

class DoubanBookSearch extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      books:[],
      keyword:'',
      highRatingOnly:false
    };
    this.getBooks = _.debounce((keyword)=>{
      $.ajax({
        dataType: 'jsonp',
        url:this.props.url + '?q=' + keyword
      }).done(
          (data) => {
            this.setState({books:data.books});
          }
      ).fail(
          () => console.log('get books error')
      );
    }, 500);
    this.handleUserInput = this.handleUserInput.bind(this);
  }
  handleUserInput(keyword, highRatingOnly){
    this.setState({
        keyword:keyword,
        highRatingOnly:highRatingOnly
    });
    if(keyword.trim()){
      this.getBooks(keyword);
    }else{
      this.setState({books:[]});
    }
  }
  render(){
    return (
      <div id="douban-search-app">
        <Logo/>
        <SearchBox keyword={this.state.keyword} highRatingOnly={this.state.highRatingOnly} onUserInput={this.handleUserInput} />
        <BookList books={this.state.books} highRatingOnly={this.state.highRatingOnly}/>
      </div>
    );
  }
}

ReactDom.render(
  <DoubanBookSearch url="https://api.douban.com/v2/book/search"/>,
  document.getElementById('container')
);
