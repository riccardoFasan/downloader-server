import express, { NextFunction, Request, Response } from 'express';
import ytdl from 'ytdl-core';

const app = express();

app.use((_: Request, response: Response, next: NextFunction) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/info', async (request: Request, response: Response) => {
  const params = request.query;
  const videoUrl: string | undefined = params.videoUrl as string | undefined;

  if (!videoUrl) {
    response.status(400).send('Bad Request');
    return;
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    response.send(info);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get('/download', (request: Request, response: Response) => {
  const params = request.query;
  const videoUrl: string | undefined = params.videoUrl as string | undefined;

  if (!videoUrl) {
    response.status(400).send('Bad Request');
    return;
  }

  response.header('Content-Type', 'audio/mp3');

  ytdl(videoUrl, {
    filter: 'audioonly',
    // @ts-ignore
    format: 'mp3',
  }).pipe(response);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
