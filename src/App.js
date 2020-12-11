import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
import TracksContainer from './TracksContainer';


const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
  
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      nowPlaying: { name: 'No Song Playing', albumArt: '' },
      search: '',
      searchResults: [],
      trackID: '',
      playlists: [],
      trackNames: [],
      playlistFeatures: []

     
    }
  }

componentDidMount = () => {
  
 
  this.getPlaylists()
   
}

componentWillUnmount = () => {
}

componentDidUpdate = () => {
//spent a lot of time 
}



  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getPlaylists = () => {
    
    spotifyApi.getUserPlaylists().then((data) => {
      // console.log('playlists', data);
      let playlists = data.items;
      // console.log(playlists)
      let data_obj = []
      for(let i = 0; i < playlists.length; i++) {
        data_obj.push(playlists[i])
      }
      // console.log(data_obj[1].name)
      this.setState({

        playlists: data_obj,
      
      
      })
     
    })
  }

  getTrack = (event) => {
    event.preventDefault()
    spotifyApi.searchTracks(`${this.state.search}`).then((data) => {
      // console.log('search results', data);
      let data_obj = []
      for(let i = 0; i < data.tracks.items.length; i++) {
        data_obj.push(data.tracks.items[i])
      }
      // console.log(data_obj[1].name)  
      this.setState({

        searchResults: data_obj,

      })
      },
      function (err) {
        console.error(err);
      }
    );
  }



  getPlaylistFeatures = (event) => {
    console.log(event)
    this.setState({
      trackNames: [],
      playlistFeatures: []

    })
    let res = event.split('/')
    let id = res[5]
    spotifyApi.getPlaylist(id)
      .then((playlistData) => {
       
        let data_obj = []
        console.log('playlist data console log', playlistData)
        
     
        for (let i = 0; i < playlistData.tracks.items.length; i++) {
          spotifyApi.getAudioFeaturesForTrack(playlistData.tracks.items[i].track.id).then((data) => {
            data_obj = this.state.trackNames.slice(0)
            let song = playlistData.tracks.items[i]
              song['data'] = data
                console.log(song)
                  data_obj.push(song)
                
      
              this.setState({

                trackNames: data_obj

              })
            
            // data_obj = this.state.trackNames 
          // console.log('inside FOR loop spotify api call', Date.now())
          })
        }

        // console.log('playlist features log', this.state.playlistFeatures)
      },function (err) {
        console.error(err);
      });
  }
  
  getTrackFeatures = (event, songName, artistName) => {
  spotifyApi.getAudioFeaturesForTrack(`${event}`)
  .then((data) => {
    // console.log(songName)
    // console.log('by', artistName)
    // console.log(data.key)
    // console.log(data.mode)
    // console.log(data.tempo)   Good for history
    
    const songBody = JSON.stringify({

          name: songName,
          artist: artistName,
          key: data.key,
          mode: data.mode,
          tempo: data.tempo

      })

      const url = process.env.REACT_APP_API_URL + "/tracks/"
      fetch(url, {
        method: 'POST',
        // mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: songBody
      })
       
        
    }).catch(err => console.log("bad things happened", err))
}

render() {
  
    const majorMinor = new Map();
    majorMinor.set(0, "Minor" );
    majorMinor.set(1, "Major");
    
    const keys = []

    const keySet = new Map();
    keySet.set(0, "C");
    keySet.set(1, "C#");
    keySet.set(2, "D");
    keySet.set(3, "D#");
    keySet.set(4, "E");
    keySet.set(5, "F");
    keySet.set(6, "F#");
    keySet.set(7, "G");
    keySet.set(8, "G#");
    keySet.set(9, "A");
    keySet.set(10, "A#");
    keySet.set(11, "B");
    keySet.set(12, "C");
    


// for(let i = 0; i < this.state.playlistFeatures.length; i++) {
//   for(let j = 0; j < this.state.trackNames.length; j++) {
//     if(this.state.trackNames[j].track.id === this.state.playlistFeatures[i].id) {
//       return this.state.trackNames[]
//     }
//   }
// }

    return (
    
    <div className="App"> 
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600&display=swap" rel="stylesheet" />
 <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <div className="app-container">
          { 
            this.state.loggedIn 
            ?
            <React.Fragment>
              <div className="search-container">
                <h3>Find a Song</h3>
                  <form onSubmit={this.getTrack}>
                    <input 
                      type="text"
                      name='search'
                      value={this.state.search}
                      onChange={event => this.setState({ search: event.target.value})}>
                    </input>
                    <button 
                      type = 'submit'>Search
                    </button>
                  </form>  
              
              
                {this.state.searchResults.map((item, i) =>(
                  <div key={i}>
                    <img src={item.album.images[1].url}></img><br/>
                      {item.name} by {item.artists[0].name} <br/>
                  
                    <button 
                      value={item.id} 
                      name={item.name}
                      onClick={event => this.getTrackFeatures(event.target.value, item.name, item.artists[0].name)}>Analyze Track
                    </button>
                  </div>
                ))}
            
              </div>
              
                <div className="tracks-results">
                  <TracksContainer />
                </div>
              <div className="playlists-container">
                
                  <h3>Your Playlists</h3>  
                  <div>
                      {this.state.playlists.map((playlist, i) => (
                        <div className='playlists' key={i}>
                          <p>{playlist.name}   <button 
                          value={playlist.tracks.href} 
                          name={playlist.name}
                          onClick={event => this.getPlaylistFeatures(event.target.value)}>Analyze Playlist
                        </button></p>
                     
                        </div>
                      ))}
                  </div>
              </div>

              
              
              <div className="tracks-container">
                  {this.state.trackNames.map((trackName, i) => (
                  
                          <ul className="no-bullets" key={i}>
                            <li>{trackName.track.name}</li>
                            <li>{trackName.track.artists[0].name}</li>
                            <li>{keySet.get(trackName.data.key)} {majorMinor.get(trackName.data.mode)}</li>
                            <li>Tempo: {Math.round(trackName.data.tempo)}</li>
                          </ul> 
                    
                  ))}
              </div> 
               
            </React.Fragment>
                :
              <div className="start">
                <a href='https://spotify-keysntempo-backend.herokuapp.com/' > Login to Spotify </a>
              </div>
              }

            
            </div>
        
      </div>
    );
  }
}

export default App;
