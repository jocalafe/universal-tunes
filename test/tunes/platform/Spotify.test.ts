import Spotify from '@/tunes/platforms/Spotify';
import { TrackNotFoundError } from '@/tunes/platforms/error';
import SpotifyWebApi from 'spotify-web-api-node';

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

  describe('methods', () => {
    let spotify: Spotify;
    const mock = {
      clientCredentialsGrant: jest.fn().mockResolvedValue({
        body: {
          access_token: 'test',
        },
      }),
      searchTracks: jest.fn(),
      setAccessToken: jest.fn(),
    };

    beforeEach(() => {
      mockedSpotifyWebApi.mockImplementation(() => mock);

      spotify = new Spotify();
    });

    describe('getTrackDetails', () => {
      test('returns details when song is found', (done) => {
        mock.searchTracks.mockResolvedValue({
          body: {
            tracks: {
              items: [{
                album: {
                  name: 'testalbum',
                },
                artists: [{
                  name: 'testartist',
                }],
                external_urls: {
                  spotify: 'spotify.com/testtrack',
                },
                name: 'testtrack',
              }],
            },
          },
        });

        spotify.getTrackDetails('https://open.spotify.com/tracks/testtrack').then((trackUrl) => {
          expect(trackUrl).toStrictEqual({
            album: 'testalbum',
            artists: ['testartist'],
            name: 'testtrack',
          });

          done();
        });

      });

      test('throws error when track not found', (done) => {
        mock.searchTracks.mockResolvedValue({ body: {} });

        spotify.getTrackDetails('https://open.spotify.com/tracks/testtrack').catch((error) => {
          expect(error).toBeInstanceOf(TrackNotFoundError);
          done();
        });
      });
    });

    describe('getTrackUrl', () => {
      test('returns url when song is found', (done) => {
        mock.searchTracks.mockResolvedValue({
          body: {
            tracks: {
              items: [{
                external_urls: {
                  spotify: 'https://open.spotify.com/tracks/testtrack',
                },
              }],
            },
          },
        });

        spotify.getTrackUrl('testtrack').then((trackUrl) => {
          expect(trackUrl).toBe('https://open.spotify.com/tracks/testtrack');
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

    describe('isPlatformUrl', () => {
      test('is spotify url', () => {
        expect(spotify.isPlatformUrl('https://open.spotify.com/tracks/testtrack'))
          .toBeTruthy();
      });

      test('is not spotify url', () => {
        expect(spotify.isPlatformUrl())
          .toBeFalsy();
      });
    });
  });

});
