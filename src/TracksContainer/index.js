import React, { Component } from 'react'


// import EditTrackModal from '../EditTrackModal'

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





//   editTrack = (idOfTrackToEdit) => {
//     console.log("you are trying to edit Track with id: ", idOfTrackToEdit)
//     this.setState({
//       idOfTrackToEdit: idOfTrackToEdit
//     })
//   }

//   updateTrack = async (updatedTrackInfo) => {
//     try {
//       const url = process.env.REACT_APP_API_URL + "/tracks/" + this.state.idOfTrackToEdit

//       const updateTrackResponse = await fetch(url, {
//         credentials: 'include',
//         method: 'PUT',
//         body: JSON.stringify(updatedTrackInfo),
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       })

//       console.log("updateTrackResponse", updateTrackResponse)
//       const updateTrackJson = await updateTrackResponse.json()
//       console.log("updateTrackJson", updateTrackJson)

//       if(updateTrackResponse.status === 200) {
//         const tracks = this.state.tracks
//         const indexOfTrackBeingUpdated = tracks.findIndex(Track => Track._id === this.state.idOfTrackToEdit)
//         tracks[indexOfTrackBeingUpdated] = updateTrackJson
//         this.setState({
//           tracks: tracks,
//           idOfTrackToEdit: -1 // close the modal
//         })
//       }

//     } catch(err) {
//       console.log("Error updating dog info: ", err)
//     }
//   }
  
closeTrackModal = () => {
    this.setState({
      idOfTrackToEdit: -1
    })
  }



//   updatePlayer = async (updateTrackInfo) => {
//     try {
//       const url = process.env.REACT_APP_API_URL + "/tracks/" + this.state.idOfTrackToEditForPlayer
//       const updatePlayerResponse = await fetch(url, {
//         method: 'PUT',
//         body: JSON.stringify(updateTrackInfo),
//         headers: {
//           'Content-Type': 'application.json'
//         }
//       })
//       console.log("updatePlayerResponse", updatePlayerResponse)
//       const updatePlayerJson = await updatePlayerResponse.json()
//       console.log("updatePlayerJson", updatePlayerJson)
//       if(updatePlayerResponse.status === 200) {
//         const tracks = this.state.tracks
//         const indexOfTrackBeingUpdated = tracks.findIndex(Track => Track._id === this.state.idOfTrackToEditForPlayer)
//         tracks[indexOfTrackBeingUpdated] = updatePlayerJson
//         this.setState({
//           tracks: tracks,
//         })
//       }
//     } catch(err) {
//       console.log("Error adding player: ", err)
//     }
//   }


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
