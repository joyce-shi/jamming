import React from 'react';
import Playlist from '../Playlist/Playlist';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';

import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistName: 'playlistName',
      playlistTracks: [{
        name: 'name',
        artist: 'artist',
        album: 'album',
        id: '3'
      }],
      searchResults: [{
        name: 'name',
        artist: 'artist',
        album: 'album',
        id: '1'
      }, {
        name: 'name2',
        artist: 'artist2',
        album: 'album2',
        id: '2',
      }] // tmp
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track); // if needs to be added to the playlist
    this.setState({
      playlistTracks: tracks
    })
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({
      playlistTracks: tracks
    })
  }

  render() {
    return (
      <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar/>
            <div className="App-playlist">
              <SearchResults onAdd={this.addTrack} searchResults={this.state.searchResults}/>
              <Playlist onRemove={this.removeTrack} playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks}/>
            </div>
          </div>
      </div>
    );
}
}

export default App;
