"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftManager = exports.Get = exports.MakeCandyDraft = exports.Dummy = void 0;
var lstCandyDraft = [];
/** Returns a list of all the named save files. */
function Dummy(req, res) {
    var name = first(req.query.name);
    if (name === undefined) {
        res.status(400).send('missing "name" parameter');
    }
    else {
        res.json("Hi, ".concat(name));
    }
}
exports.Dummy = Dummy;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param) {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
}
// creates the candy draft
function MakeCandyDraft(req, res) {
    var candyType = req.body.candyType;
    var drafters = req.body.drafters;
    var rounds = req.body.rounds;
    var onTheBoard = [];
    var id = lstCandyDraft.length;
    if (candyType === undefined || candyType.length === 0) {
        res.status(400).send('missing "candyType" parameter');
        return;
    }
    if (drafters === undefined || drafters.length === 0) {
        res.status(401).send('missing "drafters" parameter');
        return;
    }
    if (rounds === undefined) {
        res.status(402).send('missing "rounds" parameter');
        return;
    }
    // load up the draft board
    for (var i = 0; i < candyType.length; i++) {
        onTheBoard.push(candyType[i]);
    }
    var candyDraft = {
        id: id,
        rounds: rounds,
        indexTracker: 0,
        roundTracker: 1,
        candyType: candyType,
        drafters: drafters,
        currPick: [],
        checker: false,
        onTheBoard: onTheBoard
    };
    lstCandyDraft.push(candyDraft);
    res.json(lstCandyDraft[id]);
}
exports.MakeCandyDraft = MakeCandyDraft;
function Get(req, res) {
    var id = parseInt(first(req.query.id), 10);
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
exports.Get = Get;
function DraftManager(req, res) {
    var id = parseInt(req.body.id, 10);
    if (id === undefined || typeof id !== 'number') {
        res.status(400).send("missing 'id' parameter");
        return;
    }
    if (id < 0 || id >= lstCandyDraft.length) {
        res.status(404).send('Invalid no draft');
        return;
    }
    var draft = lstCandyDraft[id];
    var pick = req.body.option;
    if (pick === undefined) {
        res.status(400).send("missing 'option' parameter");
        return;
    }
    var drafter = draft.drafters[draft.indexTracker];
    draft.currPick.push({ drafter: drafter, pick: pick });
    var isRoundFinished = draft.currPick.length > 0 && draft.currPick.length % draft.drafters.length === 0;
    if (isRoundFinished) {
        draft.roundTracker++;
    }
    if (draft.onTheBoard.length - 1 === 0 || draft.roundTracker > draft.rounds) {
        draft.checker = true;
    }
    var updatedBoard = [];
    // goes through list and checks to see if it is not the pick
    for (var i = 0; i < draft.onTheBoard.length; i++) {
        if (draft.onTheBoard[i] !== pick) {
            updatedBoard.push(draft.onTheBoard[i]);
        }
    }
    draft.onTheBoard = updatedBoard;
    draft.indexTracker = (draft.indexTracker + 1) % draft.drafters.length;
    res.json(lstCandyDraft[id]);
}
exports.DraftManager = DraftManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFjQSxJQUFNLGFBQWEsR0FBaUIsRUFBRSxDQUFDO0FBRXZDLGtEQUFrRDtBQUNsRCxTQUFnQixLQUFLLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDL0MsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO1FBQ3RCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7S0FDbEQ7U0FBTTtRQUNMLEdBQUcsQ0FBQyxJQUFJLENBQUMsY0FBTyxJQUFJLENBQUUsQ0FBQyxDQUFDO0tBQ3pCO0FBQ0gsQ0FBQztBQVBELHNCQU9DO0FBR0Qsd0VBQXdFO0FBQ3hFLDRFQUE0RTtBQUM1RSxtREFBbUQ7QUFDbkQsU0FBUyxLQUFLLENBQUMsS0FBVTtJQUN2QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEI7U0FBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtRQUNwQyxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU07UUFDTCxPQUFPLFNBQVMsQ0FBQztLQUNsQjtBQUNILENBQUM7QUFFRCwwQkFBMEI7QUFDMUIsU0FBZ0IsY0FBYyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQ3hELElBQU0sU0FBUyxHQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQy9DLElBQU0sUUFBUSxHQUFhLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdDLElBQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMs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