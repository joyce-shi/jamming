let accessToken;
const clientId = ''; // insert client id here
const redirectUri = 'http://localhost:3000/';

const Spotify = {

  getAccessToken: () => {
    if (accessToken) {
      return accessToken;
    }
    const accessUrlToken = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
    if (accessUrlToken && expiresInMatch) {
      accessToken = accessUrlToken[1];
      const expirationTime = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search: (searchParameter) => {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchParameter}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) { // no tracks exist
        return [];
      } return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri,
      }));
    });
  },

  savePlaylist: (playlistName, trackUris) => {
    if (!playlistName || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}`};
    let userId;

    return fetch('https://api.spotify.com/v1/me', { headers: headers }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      userId = jsonResponse.id;
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({ name: playlistName}),
      }).then(response => {
        return response.json();
      }).then(jsonResponse => {
        const playlistId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({ uris: trackUris })
        })
      })
    });
  }
};

export default Spotify;
