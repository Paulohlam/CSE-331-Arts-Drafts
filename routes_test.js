"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var httpMocks = __importStar(require("node-mocks-http"));
var routes_1 = require("./routes");
describe('routes', function () {
    // Total 7 cases
    it('Dummy', function () {
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/dummy', query: { name: 'Kevin' } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.Dummy)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepEqual(res1._getJSONData(), 'Hi, Kevin');
    });
    it('MakeCandyDraft', function () {
        // check for candy options
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { options: [], drafters: ['kit', 'skit', 'sour'], rounds: 1 } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.MakeCandyDraft)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepEqual(res1._getData(), 'missing "options" parameter');
        // check for no drafters
        var re2 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { options: ['kit', 'skit', 'sour'], drafters: [], rounds: 1 } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.MakeCandyDraft)(re2, res2);
        assert.strictEqual(res2._getStatusCode(), 401);
        assert.deepEqual(res2._getData(), 'missing "drafters" parameter');
        // case 1 of creating draft
        var req3 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { options: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3 } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.MakeCandyDraft)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepEqual(res3._getJSONData(), { id: 0, options: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3, pickAndDrafter: [], done: false, currDrafterIndex: 0, availOptions: ['kit', 'skit', 'sour'], roundsIndex: 1 });
        // case for no given drafters
        var req4 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { options: ['kit', 'skit', 'sour'], rounds: 1 } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.MakeCandyDraft)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 401);
        assert.deepEqual(res4._getData(), 'missing "drafters" parameter');
        // case for no specified rounds
        var req5 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { options: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'] } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.MakeCandyDraft)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 402);
        assert.deepEqual(res5._getData(), 'missing "rounds" parameter');
        // case for no candy options given
        var req6 = httpMocks.createRequest({ method: 'POST', url: '/api/create', body: { drafters: ['kit', 'skit', 'sour'], rounds: 1 } });
        var res6 = httpMocks.createResponse();
        (0, routes_1.MakeCandyDraft)(req6, res6);
        assert.strictEqual(res6._getStatusCode(), 400);
        assert.deepEqual(res6._getData(), 'missing "options" parameter');
    });
    it('DraftManager', function () {
        // case no cnady options
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/api/draft', body: { id: 0 } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.DraftManager)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepEqual(res1._getData(), "missing 'option' parameter");
        // error when id is not found
        var req2 = httpMocks.createRequest({ method: 'POST', url: '/api/draft', body: { id: 55, option: 'kit' } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.DraftManager)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 404);
        assert.deepEqual(res2._getData(), 'Invalid no draft');
        // erorr when id is not a valid id
        var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/getDraft', query: { id: "100" } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.DraftManager)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 404);
        assert.deepEqual(res3._getData(), "Invalid no draft");
        // error when id is not given
        var req4 = httpMocks.createRequest({ method: 'POST', url: '/api/draft', body: { option: 'kit' } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.DraftManager)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 400);
        assert.deepEqual(res4._getData(), "missing 'id' parameter");
        // case draft func 
        var req5 = httpMocks.createRequest({ method: 'POST', url: '/api/draft', body: { id: 0, option: 'sour' } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.DraftManager)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 200);
        assert.deepEqual(res5._getJSONData(), { id: 0, options: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3,
            pickAndDrafter: [{ pick: 'kit', drafter: 'kit' }, { pick: 'skit', drafter: 'skit' }], done: false,
            currDrafterIndex: 2, availOptions: ['sour'], roundsIndex: 1 });
    });
    // 3 test cases for Get func ***double check****
    it('Get', function () {
        // case checking get func
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/getDraft', query: { id: "0" } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.Get)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 200);
        assert.deepEqual(res1._getJSONData(), { id: 0, options: ['kit', 'skit', 'sour'], drafters: ['kit', 'skit', 'sour'], rounds: 3, pickAndDrafter: [], done: false, currDrafterIndex: 0, availOptions: ['kit', 'skit', 'sour'], roundsIndex: 1 });
        // case no given id
        var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/getDraft', query: {} });
        var res2 = httpMocks.createResponse();
        (0, routes_1.Get)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepEqual(res2._getData(), 'missing "id" parameter');
        // case invalid id 
        var req3 = httpMocks.createRequest({ method: 'GET', url: '/api/getDraft', query: { id: "100" } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.Get)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 404);
        assert.deepEqual(res3._getData(), "Invalid no draft");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUNqQyx5REFBNkM7QUFDN0MsbUNBQW9FO0FBR3BFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsZ0JBQWdCO0lBQ2hCLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDVixJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUNoQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QyxJQUFBLGNBQUssRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDbkIsMEJBQTBCO1FBQzFCLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxhQUFhLENBQ2hDLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQzdHLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxj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