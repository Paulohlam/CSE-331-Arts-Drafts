import { Request, Response } from "express";

type CandyDraft = {
  id: number;
  rounds: number;
  indexTracker: number;
  roundTracker: number;
  candyType: string[];
  drafters: string[];
  currPick: {pick: string, drafter: string}[];
  checker: boolean;
  onTheBoard: string[];
}

const lstCandyDraft: CandyDraft[] = [];

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}

// creates the candy draft
export function MakeCandyDraft(req: Request, res: Response) {
  const candyType: string[] = req.body.candyType;
  const drafters: string[] = req.body.drafters;
  const rounds: number = req.body.rounds;
  const onTheBoard: string[] = [];
  const id = lstCandyDraft.length;

  if (candyType === undefined || candyType.length === 0) {
    res.status(400).send('missing "candyType" parameter');
    return;
  }

  if (drafters === undefined || drafters.length === 0) {
    res.status(401).send('missing "drafters" parameter')
    return;
  }

  if (rounds === undefined) {
    res.status(402).send('missing "rounds" parameter')
    return;
  }

  // load up the draft board
  for (let i = 0; i < candyType.length; i++) {
    onTheBoard.push(candyType[i]);
  }

  const candyDraft: CandyDraft = {
    id: id,
    rounds: rounds,
    indexTracker: 0,
    roundTracker: 1,
    candyType: candyType,
    drafters: drafters,
    currPick: [],
    checker: false,
    onTheBoard: onTheBoard
  }

  lstCandyDraft.push(candyDraft);
  res.json(lstCandyDraft[id]);
}

export function Get(req: Request, res: Response) {
  const id = parseInt(first(req.query.id) as string, 10);

  if (first(req.query.id) === undefined) {
    res.status(400).send('missing "id" parameter');
    return;
  }

  if (id < 0 || id >= lstCandyDraft.length) {
    res.status(404).send('Invalid no draft');
    return;
  }
  res.json(lstCandyDraft[id]);
}

export function DraftManager(req: Request, res: Response) {
  const id = parseInt(req.body.id as string, 10);

  if (id === undefined  || isNaN(id) || typeof id !== 'number') {
    res.status(400).send("missing 'id' parameter");
    return;
  }

  if (id < 0 || id >= lstCandyDraft.length) {
    res.status(404).send('Invalid no draft');
    return;
  }

  const draft = lstCandyDraft[id];
  const pick = req.body.option;

  if (pick === undefined) {
    res.status(400).send("missing 'candyType' parameter");
    return;
  }

  const drafter = draft.drafters[draft.indexTracker];
  draft.currPick.push({drafter: drafter, pick: pick});

  const isRoundFinished = draft.currPick.length > 0 && draft.currPick.length % draft.drafters.length === 0;
  if (isRoundFinished) {
    draft.roundTracker++;
  }

  if (draft.onTheBoard.length - 1 === 0 || draft.roundTracker > draft.rounds) {
    draft.checker = true;
  }

  const updatedBoard: string[] = [];

  // goes through list and checks to see if it is not the pick
  for (let i = 0; i < draft.onTheBoard.length; i++) {
    if (draft.onTheBoard[i] !== pick) {
      updatedBoard.push(draft.onTheBoard[i]);
    }
  }

  draft.onTheBoard = updatedBoard;
  draft.indexTracker = (draft.indexTracker + 1) % draft.drafters.length;
  res.json(lstCandyDraft[id]);
}