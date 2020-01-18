import SpotifyWebApi from 'spotify-web-api-node';
import { TrackNotFoundError } from './error';
import { Platform } from './index.d';

const grantAccess = async (spotifyApi: SpotifyWebApi) => {
  const { body: { access_token: accessToken } } = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(accessToken);
};

export default class Spotify implements Platform {
  private api: SpotifyWebApi;

  constructor() {
    this.api = new SpotifyWebApi({
      clientId: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
    });
  }

  public getTrackUrl = async (name: string): Promise<string> => {
    await grantAccess(this.api);

    const trackResponse = await this.api.searchTracks(`track:${name}`);

    if (!trackResponse.body.tracks) {
      throw new TrackNotFoundError(name, 'Spotify');
    }

    return trackResponse.body.tracks.items[0].external_urls.spotify;
  }
}