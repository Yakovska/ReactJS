var WeatherItem = React.createClass({ //one block weather
	render: function() {
		return (//array blocks weather
			<div className = "weatherItem">
			<h2 className = "weatherHeader"> {this.props.type}</h2>
			<img className = "weatherImg"  src={this.props.src} />
			<p className = "weatherTemp" >{this.props.temp}{this.props.tempFrom}{this.props.tempTo} C</p>
			</div>
			); 
	}
});

var WeatherBox = React.createClass({ //full weather block (title, form, city title, wetaher items)
	handleWeatherSubmit: function(text) {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: 'cityName=' + text,
			success: function(data) {
				this.setState({data: data, cityName: [{"cityName": data[0].cityName}] });
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function() {
		return {data: [], cityName: [{"cityName":"  "}]};
	},
	render: function() {
		return (
			<div className="wetherBox">
			<h1 className="weatherHead"> прогноз погоды</h1>
			<WeatherForm onWeatherSubmit={this.handleWeatherSubmit} />
			<WeatherCityName cityName={this.state.cityName[0].cityName} />
			<WeatherList data={this.state.data} />
			</div>
			);
	}
});

var WeatherCityName = React.createClass({ // date and city title
	render: function(){
		var d = new Date();
		var dateNow = String(d.getMonth()+1).replace(/^(.)$/, "0$1") +'/'+ String(d.getDate()).replace(/^(.)$/, "0$1") + '/' + d.getFullYear();
		return(
			<div>
			<p>{dateNow}</p>
			<h2>{this.props.cityName}</h2>
			</div>	
			);
	}
});

var WeatherList = React.createClass({ // block for weather blocks
	render: function() {
		var weatherNodes = this.props.data.map(function(weatherItem){
			if(weatherItem.cityid == false){ //check entered in the value field
				return(
					<p className="weatherFalse">Похоже Вы ввели неверное название города (попробуйте ввести название с большой буквы)</p>
					);
			}
			return (
				<WeatherItem 
				cityid = {weatherItem.cityid}
				type = {weatherItem.type} 
				src = {weatherItem.src} 
				temp = {weatherItem.temp} 
				tempFrom = {weatherItem.tempFrom} 
				tempTo = {weatherItem.tempTo} 
				key = {weatherItem.id}>
				</WeatherItem>
				);
		});

		return (
			<div className="weatherList">
			{weatherNodes}
			</div>
			);
	}
});

var WeatherForm = React.createClass({ // form
	getInitialState: function() {
		return {text: ''}; // state input field
	},
	handleTextChange: function(e) {
		this.setState({text: e.target.value}); // tracking changes in the input field
	},
	handleSubmit: function(e) {
		e.preventDefault();
		var text = this.state.text.trim();
		if (!text) {
			return
			alert('not text');
		}
		this.props.onWeatherSubmit(text);   
		this.setState({text: ''});
	},
	render: function() {
		return (
			<form className="weatherForm" onSubmit={this.handleSubmit}>
			<input className="weatherInput" type="text" placeholder="Введите название города" value={this.state.text} onChange={this.handleTextChange}/>
			</form>
			);
	}
});

ReactDOM.render( // rendering
	<WeatherBox url="weather.php" />,
	document.getElementById('content')
	);