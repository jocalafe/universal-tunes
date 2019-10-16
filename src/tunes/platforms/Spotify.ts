import SpotifyWebApi from 'spotify-web-api-node';
import { ITrack } from '../index.d';
import { TrackNotFoundError } from './error';
import { IPlatform } from './index.d';

const grantAccess = async (spotifyApi: SpotifyWebApi): Promise<void> => {
  const { body: { access_token } } = await spotifyApi.clientCredentialsGrant();

  spotifyApi.setAccessToken(access_token);
};

const getTracks = async (
    api: SpotifyWebApi,
    query: string,
  ): Promise<SpotifyApi.PagingObject<SpotifyApi.TrackObjectFull>> => {
    await grantAccess(api);

    const trackResponse = await api.searchTracks(`track:${query}`);
    const tracks = trackResponse.body.tracks;

    if (!tracks) {
      throw new TrackNotFoundError(query, 'Spotify');
    }

    return tracks;
};

const parseUrl = (url: string): string => {
  const splitUrl = url.split('/');

  return splitUrl[splitUrl.length - 1];
};

export default class Spotify implements IPlatform {
  private api: SpotifyWebApi;

  constructor() {
    this.api = new SpotifyWebApi({
      clientId: `${process.env.CLIENT_ID}`,
      clientSecret: `${process.env.CLIENT_SECRET}`,
    });
  }

  public isPlatformUrl(url?: string): boolean {
    return !!url;
  }

  public getTrackDetails = async (url: string): Promise<ITrack> => {
    const tracks = await getTracks(this.api, parseUrl(url));
    const track = tracks.items[0];

    return {
      album: track.album.name,
      artists: track.artists.map(({ name }: SpotifyApi.ArtistObjectSimplified) => name),
      name: track.name,
    };
  }

  public getTrackUrl = async (name: string): Promise<string> => {
    const tracks = await getTracks(this.api, name);

    return tracks.items[0].external_urls.spotify;
  }
}
