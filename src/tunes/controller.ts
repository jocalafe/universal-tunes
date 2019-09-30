import { Request, Response } from 'express';
import { Spotify } from './platform';

export const getTrack = async (req: Request, res: Response) => {
  const { params: { name } } = req;

  console.log(`searching for song ${name} in platforms`);

  const spotify = new Spotify();

  const trackUrl = await spotify.getTrackUrl(name).catch(console.error);

  res.send({ trackUrl });
};
