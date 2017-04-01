class Filters extends React.Component{
	render(){
		let tags = this.props.filters.map((f) => {
			return(<span >{f}<button type="button" className="btn btn-danger" name={f} onClick={this.props.whenClose}>&times;</button></span>);
		});
		return(<span>Applied Filters:  
				{tags}
			</span>
			);
	}
}
class Sort extends React.Component{
	render(){
		return(<select onChange={this.props.whenSort}>
				<option value = "asce"> low to high</option>
				<option value = "desc"> high to low </option>
			</select>);
	}
}
class SeachComponent extends React.Component{
	render(){
		return (
				<div className="container">
					<div className="col-xs-12">
						<input type="search" className="search form-control" placeholder="Search...title, country, blurp, by, location" onKeyPress = {this.props.whenChange}/>
					</div>
					<div className="col-xs-12">
						<div className="col-xs-6">
							<Filters filters = {this.props.filters} whenClose = {this.props.whenClose}/>
						</div>
						<div className="col-xs-6">
							Sort by funding: <Sort whenSort={this.props.whenSort}/>
						</div>						
					</div>
				</div>
			)
	}
}

class Kickstarter extends React.Component{
	 
	render(){
		return(
			<div>
				<div className="card" data-toggle="modal" data-target={'#'+this.props.item['s.no']}>
					<div className="card-block">
						<h4 className="card-title">{this.props.item.title}</h4>
						<h6 className="card-text">Pledge: <span>{this.props.item['amt.pledged']}</span></h6>
						<h6 className="card-text">Backers: <span>{this.props.item['num.backers']}</span></h6>
						<h6 className="card-text">funded: <span>{this.props.item['percentage.funded']}</span></h6>
					</div>
				</div>
				<div id={this.props.item['s.no']} className="modal fade" role="dialog">
						  <div className="modal-dialog">						   
						    <div className="modal-content">
						      <div className="modal-header">
						        <button type="button" className="close" data-dismiss="modal">&times;</button>
						        <h6 className="modal-title">{this.props.item.title}</h6>
						      </div>
						      <div className="modal-body">
						      	<p>{this.props.item.blurb}</p>
						        <div>Pledge: <span>{this.props.item['amt.pledged'] +" "+ this.props.item.currency}</span>|  Backers: <span>{this.props.item['num.backers']}</span></div>
								<div><a href={"https://www.kickstarter.com"+this.props.item.url} target="_blank">Visit Project site</a></div>
						      </div>
						      <div className="modal-footer">
						        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						      </div>
						    </div>

						  </div>
				</div>
		</div>);
	}
}

class ListKickStarters extends React.Component{
	
	render(){
		const kickstarterlist = this.props.list.length ? this.props.list.map((ks) => {
			return(<div className="kickstarter container"><Kickstarter item ={ks}/></div>);
		}) : <div className="kickstarter container">No Matches Found</div>;
		return(<div className="kickstarterlist">
			{kickstarterlist}
		'</div>)
	}
}

class ShowKickStarters extends React.Component{
	constructor(){
		super();
		this.state = {
			list: [],
			filters: [],
			sorts: {fund: 'asce'}
		};
		this.search = this.search.bind(this);
		this.removeFilter = this.removeFilter.bind(this);
		this.sort = this.sort.bind(this);
	}
	componentWillMount(){
		fetch('http://starlord.hackerearth.com/kickstarter').then((response) => {
			return response.json();
		}).then((res) => {
			this.setState({list: res});
		}); 
	}
	search(ev){
		if(ev.key === "Enter"){
			let term = ev.currentTarget.value.toLowerCase();
			let filters = this.state.filters;
			if(filters.indexOf(term) === -1){
				filters.push(term);
				ev.currentTarget.value = "";
				this.setState({filters: filters});
			}			
		}		
	}
	removeFilter(ev){
		let filterList = this.state.filters;
		let term = ev.currentTarget.name;
		let index = filterList.indexOf(term);
		if (index > -1) {
		   filterList.splice(index, 1);
		}
		this.setState({filters: filterList});		
	}
	sort(ev){
		let sortType = ev.currentTarget.value;
		this.setState({sorts:{fund: sortType}});
	}
	getList(){
		let result = this.state.list; 
		if(this.state.filters.length){			
			this.state.filters.forEach((filter) => {
				result = this.state.list.filter((item) => {
					//.title, country, blurp, by, location
					if(item.title.toLowerCase().includes(filter) || item.blurb.toLowerCase().includes(filter) || item.country.toLowerCase().includes(filter) || item.location.toLowerCase().includes(filter) || item.state.toLowerCase().includes(filter) || item.by.toLowerCase().includes(filter)){
						return true;
					}
					return false;
				});
			});
			return result;
		}
		result = result.sort((item1, item2) =>{
			if(this.state.sorts.fund === "desc"){
				return parseInt(item2['percentage.funded']) - parseInt(item1['percentage.funded']);
			}
			else{
				return parseInt(item1['percentage.funded']) - parseInt(item2['percentage.funded']);
			}
			
		});		
		return result;
	}
	render(){
		return(
			<div>
				<SeachComponent whenChange={this.search} filters = {this.state.filters} whenClose={this.removeFilter} whenSort={this.sort}/>
				<ListKickStarters list={this.getList()} />
			</div>
			)
	}
}

ReactDOM.render(
	<ShowKickStarters />, document.getElementById('react-container')
	);