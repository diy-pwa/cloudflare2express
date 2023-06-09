import createApp from './src/ExpressApp.js';

const app = createApp();

const port = 8080;
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })