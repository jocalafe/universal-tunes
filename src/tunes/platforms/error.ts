export class TrackNotFoundError extends Error {
  constructor(track: string, platform: string) {
     super(`Track ${track} was not found in ${platform}`);

     Object.setPrototypeOf(this, TrackNotFoundError.prototype);
   }
}
