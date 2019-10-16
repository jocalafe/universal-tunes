import ITrack from '../index.d';

export interface IPlatform {
  getTrackDetails(url: string): Promise<typeof ITrack>;
  getTrackUrl(name: string): Promise<string>;
  isPlatformUrl(url: string): boolean;
}
