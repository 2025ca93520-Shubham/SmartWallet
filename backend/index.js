import 'dotenv/config.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { serverConfig, apiConfig } from './config/server.js';
import routes from './routes/index.js';
import { dataStore } from './services/dataStore.js';

const app = express();

app.use(cors(serverConfig.cors));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use(`${apiConfig.prefix}`, routes);

app.use(errorHandler);

const port = serverConfig.port;
(async () => {
  await dataStore.loadData();
  app.listen(port, () => {
    console.log(
      `SmartWallet Backend Server running on ${serverConfig.nodeEnv} mode at port ${port}`
    );
    console.log(`API Base URL: ${apiConfig.baseUrl}${apiConfig.prefix}`);
  });
})();
