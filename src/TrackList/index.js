import React from 'react'



export default function trackList(props) {
    // console.log(props)
  const tracks = props.tracks.map(track => {
    const majorMinor = new Map();
    majorMinor.set(0, "Minor" );
    majorMinor.set(1, "Major");
    
    const keySet = new Map();
    keySet.set(0, "C");
    keySet.set(1, "C#");
    keySet.set(2, "D");
    keySet.set(3, "D#");
    keySet.set(4, "E");
    keySet.set(5, "E#");
    keySet.set(6, "F");
    keySet.set(7, "F#");
    keySet.set(8, "G");
    keySet.set(9, "G#");
    keySet.set(10, "A");
    keySet.set(11, "A#");
    keySet.set(12, "B");

    
    return(
  
    <div className='song-card' key={track._id}>
        <p><h4>{track.name}</h4></p>
        <p><h4>by: {track.artist}</h4></p>
        <p><h4>key: {keySet.get(track.key)} {majorMinor.get(track.mode)}</h4></p>
        <p><h4>tempo: {Math.round(track.tempo)}</h4></p>
        <button onClick={ () => props.deleteTrack(track._id)}>Delete</button>
    </div>
   
    
    )
  })
  return(
    <div>
      {tracks}
    </div>
  )
}
