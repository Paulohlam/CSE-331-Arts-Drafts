import express from "express";
import { MakeCandyDraft, DraftManager, Get } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.post("/api/mainpage", MakeCandyDraft);
app.post("/api/draft", DraftManager)
app.get("/api/get", Get)
app.listen(port, () => console.log(`Server listening on ${port}`));
