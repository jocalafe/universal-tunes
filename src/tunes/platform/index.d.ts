export interface Platform {
  getTrackUrl(name: string): Promise<string>;
}
