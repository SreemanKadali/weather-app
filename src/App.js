import { Component } from "react";
import { RotatingLines } from "react-loader-spinner";
import BookmarkItem from "./components/BookmarkItem";
import "./App.css";

const apiConstants = {
  LOADING: "loading",
  SUCCESS: "success",
  FAIL: "fail",
};

let bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

if (bookmarks == null) {
  bookmarks = [];
}

class App extends Component {
  state = {
    status: apiConstants.LOADING,
    location: "",
    error: false,
    data: "",
    clientLocation: true,
    bookmarks: bookmarks,
  };

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.Success, this.fail);
    } else {
      alert(
        "Your browser does not support geolocation, please enter your location manually"
      );
    }
    // this.apiCall();
  }

  Success = async (currentLocation) => {
    const { latitude, longitude } = currentLocation.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=776bd0a19fe49e22d1b7e26c684e9ab2`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    this.setState({
      clientLocation: true,
      data: {
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        temp: data.main.temp,
        imgUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
      },
      status: apiConstants.SUCCESS,
    });
  };
  fail = (err) => {
    alert(
      "Your browser does not support geolocation, Please enter your location manually"
    );
    this.setState({ clientLocation: false, status: apiConstants.SUCCESS });
  };

  apiCall = async () => {
    this.setState({ status: apiConstants.LOADING });
    const { location } = this.state;
    const apikey = "776bd0a19fe49e22d1b7e26c684e9ab2";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apikey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.cod === 200) {
      this.setState({ error: false });
      console.log(data);
      this.setState({
        data: {
          city: data.name,
          country: data.sys.country,
          description: data.weather[0].description,
          feelsLike: data.main.feels_like,
          humidity: data.main.humidity,
          temp: data.main.temp,
          imgUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
        },
        status: apiConstants.SUCCESS,
      });
    } else {
      this.setState({
        error: true,
        location: "",
        status: apiConstants.SUCCESS,
      });
    }
  };

  renderLoader = () => (
    <RotatingLines
      strokeColor="white"
      strokeWidth="5"
      animationDuration="0.75"
      width="96"
      visible={true}
    />
  );

  renderWeather = () => {
    const { data, clientLocation, bookmarks } = this.state;
    const { imgUrl, temp, city, country, humidity, description } = data;
    localStorage.setItem("bookmarks", JSON.stringify([...bookmarks]));

    return (
      <>
        {clientLocation ? (
          <>
            <div className="d-flex justify-content-around align-items-center w-100">
              <div className="d-flex flex-column">
                <img className="weatherImg" src={imgUrl} alt="weatherImage" />
                <h3 className="text location">{`${city} , ${country}`}</h3>
              </div>
              <div className="d-flex flex-column">
                <h3 className=" text temp"> {temp} &deg;C</h3>
                <p className="text">{description}</p>
                <p className="text">Humidity : {humidity}%</p>
              </div>
            </div>
          </>
        ) : (
          <p>
            Unable to access your location,
            <br /> please enter your location manually
          </p>
        )}
      </>
    );
  };

  onChangeInput = (event) => {
    this.setState({ location: event.target.value });
  };

  formSubmit = (event) => {
    event.preventDefault();
    this.apiCall();
  };

  bookmarkClicked = () => {
    const { data, bookmarks } = this.state;
    console.log(bookmarks);
    if (data.city !== undefined) {
      if (!bookmarks.includes(data.city)) {
        this.setState({ bookmarks: [...bookmarks, data.city] });
      }
    }
  };

  bookmarkDelete = (item) => {
    const { bookmarks } = this.state;
    const newList = bookmarks.filter((each) => each !== item);
    this.setState({ bookmarks: newList });
  };

  bookmarkSelected = async (city) => {
    await this.setState({ location: city });
    this.apiCall();

    console.log(city);
  };

  render() {
    const { status, error, location, bookmarks } = this.state;
    // console.log(data);
    return (
      <div className="bg-container">
        <div className="container ">
          <div className="row height-100 d-flex flex-column justify-content-start align-items-center pt-5 ">
            <div className="col-11 col-md-7 col-lg-6 card mt-5 d-flex align-items-center justify-content-center">
              {status === "loading"
                ? this.renderLoader()
                : this.renderWeather()}
            </div>
            <div className="mt-3">
              <button className="button" onClick={this.bookmarkClicked}>
                BookMark City
              </button>
            </div>
            <div className="col-10 col-md-5 mt-3">
              <form onSubmit={this.formSubmit}>
                <label className="mr-3">Enter City Name</label>
                <input
                  className="form-control"
                  type="search"
                  onChange={this.onChangeInput}
                  value={location}
                ></input>
                {/* <button type="submit">Search</button> */}
                {error && (
                  <p className="errorMsg">
                    City not found <br /> try another city
                  </p>
                )}
              </form>
            </div>
            <div className="col-10 col-md-5 mt-3">
              <h3 className="">BookMarks</h3>
              <ol className="">
                {bookmarks.length !== 0 ? (
                  bookmarks.map((each) => (
                    <BookmarkItem
                      key={each}
                      city={each}
                      deleteBookmark={this.bookmarkDelete}
                      selectBookmark={this.bookmarkSelected}
                    />
                  ))
                ) : (
                  <h5>Empty</h5>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
