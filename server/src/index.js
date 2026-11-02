import { createApp } from './app.js';
import { SERVER } from './config.js';

const app = await createApp();
app.listen(SERVER.PORT, () => {
  console.log(`Reveille Brew Co. API listening on port ${SERVER.PORT}`);
});
