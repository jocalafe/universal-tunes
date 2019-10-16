import { Track } from '../../tunes';

export interface Platform {
  getTrackDetails(url: string): Promise<Track>;
  getTrackUrl(name: string): Promise<string>;
  isPlatformUrl(url: string): boolean;
}

export { default as Spotify } from './Spotify';
