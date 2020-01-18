import Spotify from '@/tunes/platform/Spotify';
import SpotifyWebApi from 'spotify-web-api-node';
import { TrackNotFoundError } from '@/tunes/platform/error';

jest.mock('spotify-web-api-node');

const mockedSpotifyWebApi = SpotifyWebApi as jest.Mock<any>;

describe('Spotify', () => {
  const OLD_ENV = process.env;

  describe('constructor', () => {
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    test('initializes api with env', () => {
      process.env.CLIENT_ID = 'testid';
      process.env.CLIENT_SECRET = 'testsecret';

      new Spotify(); // tslint:disable-line no-unused-expression

      expect(SpotifyWebApi).toHaveBeenCalledTimes(1);

      expect(SpotifyWebApi).toHaveBeenCalledWith({
        clientId: 'testid',
        clientSecret: 'testsecret',
      });
    });
  });

  describe('getTrackUrl', () => {
    let spotify: Spotify;
    const mock = {
      clientCredentialsGrant: jest.fn().mockResolvedValue({
        body: {
          access_token: 'test', // eslint-disable-line @typescript-eslint/camelcase
        },
      }),
      searchTracks: jest.fn(),
      setAccessToken: jest.fn(),
    };

    beforeEach(() => {
      mockedSpotifyWebApi.mockImplementation(() => mock);

      spotify = new Spotify();
    });

    test('returns url when song is found', (done) => {
      mock.searchTracks.mockResolvedValue({
        body: {
          tracks: {
            items: [{
              external_urls: { // eslint-disable-line @typescript-eslint/camelcase
                spotify: 'spotify.com/testtrack',
              },
            }],
          },
        },
      });

      spotify.getTrackUrl('testtrack').then((trackUrl) => {
        expect(trackUrl).toBe('spotify.com/testtrack');
        done();
      });
    });

    test('throws error when track not found', (done) => {
      mock.searchTracks.mockResolvedValue({ body: {} });

      spotify.getTrackUrl('testtrack').catch((error) => {
        expect(error).toBeInstanceOf(TrackNotFoundError);
        done();
      });
    });
  });

});
