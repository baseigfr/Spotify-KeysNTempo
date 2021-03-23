import React, { Component } from 'react'

import TrackList from '../TrackList'


// console.log(process.env.NODE_ENV)
// let baseUrl = ''

// if (process.env.NODE_ENV === 'development') {
//   baseUrl = 'http://localhost:3003'
// } else {
//   baseUrl = 'heroku url here'
// }

// console.log('current base URL:', baseUrl)

export default class TracksContainer extends Component {



  constructor(props) {
    super(props)
    this.state = {

        tracks: [],
        idOfTrackToEdit: -1
    }
  }

  
  
  componentDidMount() {
    this.setupBeforeUnloadListener();
    console.log("componentDidMount() in TrackContainer is running")
    // This will get the Tracks when the component is rendered
    this.gettracks()
    console.log(this.gettracks());
  }
  
  doSomethingBeforeUnload = () => {
    this.deleteAll()
}

// Setup the `beforeunload` event listener
setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return this.doSomethingBeforeUnload();
    });
};
// We will need to add the getTracks function here
  gettracks = async () => {
    try{
      const url = process.env.REACT_APP_API_URL + "/tracks/"
      const tracksResponse = await fetch(url)
      const tracksJson = await tracksResponse.json()
      
      if(tracksResponse.status === 200) {

        this.gettracks()

      }

      this.setState({
        tracks: tracksJson

      })

    } catch(err) {
      console.log("Error getting Track data.", err)
    }
  }

  deleteTrack = async (idOfTrackToDelete) => {
      // console.log(idOfDogToDelete)
      // it should send a request to delete dog

      try {
        const url = process.env.REACT_APP_API_URL + "/tracks/" + idOfTrackToDelete

        const deleteTrackResponse = await fetch(url, {
          method: 'DELETE'
        })
        const deleteTrackJson = await deleteTrackResponse.json()
        console.log("deleteTrackJson", deleteTrackJson)

        if(deleteTrackResponse.status === 200) {

          this.gettracks()

        }
      } catch(err) {
        console.log("Error deleting Track: ", err)
      }

    }

    deleteAll = async () => {
      // console.log(idOfDogToDelete)
      // it should send a request to delete dog

      try {
        const url = process.env.REACT_APP_API_URL + "/tracks/"

        const deleteTrackResponse = await fetch(url, {
          method: 'DELETE'
        })
        const deleteTrackJson = await deleteTrackResponse.json()
        console.log("deleteTrackJson", deleteTrackJson)

        if(deleteTrackResponse.status === 200) {

          this.gettracks()

        }
      } catch(err) {
        console.log("Error deleting Track: ", err)
      }

    }


  
closeTrackModal = () => {
    this.setState({
      idOfTrackToEdit: -1
    })
  }






render() {
    return (
      
      <React.Fragment>
        <h3>Saved Songs</h3>
        <TrackList
        tracks={this.state.tracks}
        // editTrack={this.editTrack}
        deleteTrack={this.deleteTrack}
        />
      </React.Fragment>
    )
  }
}
