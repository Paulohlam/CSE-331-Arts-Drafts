import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { Dummy, DraftManager, MakeCandyDraft, Get } from './routes';


describe('routes', function() {

  // Total 7 cases
  it('Dummy', function() {
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}});
    const res1 = httpMocks.createResponse();
    Dummy(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
  });

  it('MakeCandyDraft', function () {
    // check for candy candyType
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/mainpage', body: {candyType: [],
                                        drafters: ['kit', 'skit', 'sour'], rounds: 1}});
    const res1 = httpMocks.createResponse();
    MakeCandyDraft(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepEqual(res1._getData(), 'missing "candyType" parameter');

    // check for no drafters
    const re2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/mainpage', body: {candyType: ['kit', 'skit', 'sour'],
                                        drafters: [], rounds: 1}});
    const res2 = httpMocks.createResponse();
    MakeCandyDraft(re2, res2);
    assert.strictEqual(res2._getStatusCode(), 401);
    assert.deepEqual(res2._getData(), 'missing "drafters" parameter');

    // case 1 of creating draft
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/mainpage', body: {candyType: ['kit', 'skit', 'sour'], 
                                        drafters: ['kit', 'skit', 'sour'], rounds: 3}});
    const res3 = httpMocks.createResponse();
    MakeCandyDraft(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepEqual(res3._getJSONData(),
    {id: 0, candyType: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3, currPick: [],
                                        checker: false, indexTracker: 0, onTheBoard: ['kit', 'skit', 'sour'], roundTracker: 1});

    // case for no given drafters
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/mainpage', body: {candyType: ['kit', 'skit', 'sour'], rounds: 1}});
    const res4 = httpMocks.createResponse();
    MakeCandyDraft(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 401);
    assert.deepEqual(res4._getData(), 'missing "drafters" parameter');

    // case for no specified rounds
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/mainpage', body: {candyType: ['kit', 'skit', 'sour'],
                                        drafters: ['kit', 'skit', 'sour']}});
    const res5 = httpMocks.createResponse();
    MakeCandyDraft(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 402);
    assert.deepEqual(res5._getData(), 'missing "rounds" parameter');

    // case for no candy candyType given
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/mainpage', body: {drafters: ['kit', 'skit', 'sour'],
                                        rounds: 1}});
    const res6 = httpMocks.createResponse();
    MakeCandyDraft(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepEqual(res6._getData(), 'missing "candyType" parameter');
  });

  it('DraftManager', function () {
     // case no cnady candyType
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/draft', body: {id: 0}});
    const res1 = httpMocks.createResponse();
    DraftManager(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepEqual(res1._getData(), "missing 'candyType' parameter");

    // error when id is not found
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/draft', body: {id: 123, candyType: 'kit'}});
    const res2 = httpMocks.createResponse();
    DraftManager(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 404);
    assert.deepEqual(res2._getData(), 'Invalid no draft');

    // erorr when id is not a valid id
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/draft', body: {id: -123, candyType: 'kat'}});
    const res3 = httpMocks.createResponse();
    DraftManager(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 404);
    assert.deepEqual(res3._getData(), "Invalid no draft");

    // error when id is not given
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/draft', body: {id: undefined}});
    const res4 = httpMocks.createResponse();
    DraftManager(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepEqual(res4._getData(), "missing 'id' parameter");

    // case draft func 
    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/draft', body: {id: 0, candyType: 'sour'}});
    const res5 = httpMocks.createResponse();
    DraftManager(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepEqual(res5._getJSONData(),
    {id: 0, candyType: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3,
    currPick: [{pick: 'kit', drafter: 'kit'}, {pick: 'skit', drafter: 'skit'}], checker: false,
    indexTracker: 2, onTheBoard: ['sour'], roundTracker: 1});
  });

  // 3 test cases for Get func ***double check****
  it('Get', function () {
    // case checking get func
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {id: "0"}});
    const res1 = httpMocks.createResponse();
    Get(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 200);
    assert.deepEqual(res1._getJSONData(), 
    {id: 0, candyType: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3, currPick: 
                [], checker: false, indexTracker: 0, onTheBoard: ['kit', 'skit', 'sour'], roundTracker: 1});

    // case no given id
    const req2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {}});
    const res2 = httpMocks.createResponse();
    Get(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepEqual(res2._getData(), 'missing "id" parameter');

    // case invalid id 
    const req3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/get', query: {id: "100"}});
    const res3 = httpMocks.createResponse();
    Get(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 404);
    assert.deepEqual(res3._getData(), "Invalid no draft");
  }); 

});
