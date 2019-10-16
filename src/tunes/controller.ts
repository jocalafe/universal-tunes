import { Request, Response } from 'express';
import * as platforms from './platforms';

export const getTracks = async (req: Request, res: Response): Promise<void> => {
  const { query: { url } } = req;

  console.log(`searching for track ${url} in platforms`);

  const spotify = new platforms.Spotify();

  const trackDetails = await spotify.getTrackDetails(url);

  const trackUrl = await spotify.getTrackUrl(trackDetails.name).catch(console.error);

  res.send({ trackUrl });
};
