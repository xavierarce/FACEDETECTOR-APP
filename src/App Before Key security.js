import React, { Component } from 'react'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/logo/logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import './App.css'
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';


class App extends Component {
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      box:{},
      route: 'signin',
      isSignedIn : false,
      user:{
        id:'',
        name : '',
        password:'',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser=(data)=>{
    this.setState({user:{
      id: data.id,
      name : data.name,
      password: data.password,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000/')
  //     .then(response=>response.json()
  //     .then(console.log))
  // }

  calculateFaceLocation =(data)=>{
    const clarifaiFace = JSON.parse(data).outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height)
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol : width-(clarifaiFace.right_col * width),
      bottomRow : height-(clarifaiFace.bottom_row * width)
    }
  }

  displayFaceBox = (box) =>{
    this.setState({box:box})
  }

  onInputChange = (event) =>{
  this.setState({input:event.target.value});
  }

  onPictureSubmit = ()=>{
    this.setState({imageUrl:this.state.input})
  
    const IMAGE_URL = this.state.input;

    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": "clarifai",
        "app_id": "main"
      },
      "inputs": [
          {
          "data": {
                  "image": {
                      "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
      method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key 6c6341d2800648e98e252d49de65e010'
        },
        body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
        .then(response => response.text())
        .then(result => {
          if(result){
            fetch('http://localhost:3000/image',{
              method:'put',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify({
                id:this.state.user.id
              })
            })
              .then(result=> result.json())
              .then(count =>{
                this.setState(Object.assign(this.state.user,{entries:count})
                  //! {user:{
                  //!   entries: count
                  //! }}
                )
              })
          }
          this.displayFaceBox(this.calculateFaceLocation(result))
        })
        .catch(error => console.log('error', error));
      

  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({
        isSignedIn: false,
        route: 'signin', //! Set the route to 'signin' after signing out
      });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true, route: 'home' });
    } else {
      this.setState({ route: route });
    }
  };
  
  render() {
    const {route} = this.state;
    return (
      <div className="App">
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} route={route} />
      <ParticlesBg  type="cobweb" bg={true} />
      {this.state.route === 'home' ?
        <div>
          <Logo/>        
          <Rank 
            name={this.state.user.name} 
            entries={this.state.user.entries}
          /> 
          <ImageLinkForm 
            onInputChange={this.onInputChange}
            onPictureSubmit={this.onPictureSubmit} 
          />
          <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
        </div>
        :(
          <div>
            {route === 'signin' && <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />}
            {route === 'register' && <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />}
          </div>
        )
      }
      </div>
    );
  }
}

export default App