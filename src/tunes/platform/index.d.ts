export interface IPlatform {
  getTrackUrl(name: string): Promise<string>;
}
