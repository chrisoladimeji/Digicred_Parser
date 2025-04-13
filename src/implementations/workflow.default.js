"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultWorkflow = void 0;
var pg_1 = require("pg");
var uuid_1 = require("uuid");
var DefaultWorkflow = /** @class */ (function () {
    function DefaultWorkflow(dbClient) {
        console.log("DefaultWorkflow constructor dbCLient=", dbClient);
        this.dbClient = new pg_1.Client(dbClient);
        this.connectDB();
    }
    DefaultWorkflow.prototype.connectDB = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dbClient.connect()];
                    case 1:
                        _a.sent();
                        console.log("Database connected");
                        return [2 /*return*/];
                }
            });
        });
    };
    DefaultWorkflow.prototype.getWorkflowByID = function (workflowID) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("*** getWorkflowByID");
                        return [4 /*yield*/, ((_a = this.dbClient) === null || _a === void 0 ? void 0 : _a.query('SELECT * FROM workflows WHERE "workflow_id" = $1', [workflowID]))];
                    case 1:
                        res = _b.sent();
                        //console.log("WorkflowID=", workflowID);
                        //console.log("Workflow=", res.rows[0]);
                        return [2 /*return*/, res.rows.length > 0 ? res.rows[0] : null];
                }
            });
        });
    };
    DefaultWorkflow.prototype.getInstanceByID = function (clientID, workflowID) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, query, res, workflow;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("*** getInstanceByID");
                        instance = null;
                        query = 'SELECT * FROM instances WHERE "client_id" = $1 AND "workflow_id" = $2';
                        return [4 /*yield*/, ((_a = this.dbClient) === null || _a === void 0 ? void 0 : _a.query(query, [clientID, workflowID]))];
                    case 1:
                        res = _b.sent();
                        if (!(res.rows.length === 0)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.getWorkflowByID(workflowID)];
                    case 2:
                        workflow = _b.sent();
                        return [4 /*yield*/, this.newInstance(clientID, workflowID, workflow.initial_state)];
                    case 3:
                        // Create new instance with new instanceID, the initial state fromt he workflow, and empoty instance data
                        instance = _b.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        instance = res.rows.length > 0 ? res.rows[0] : null;
                        _b.label = 5;
                    case 5: 
                    //console.log("Instance=",  instance);
                    return [2 /*return*/, instance];
                }
            });
        });
    };
    DefaultWorkflow.prototype.newInstance = function (clientID, workflowID, stateID) {
        return __awaiter(this, void 0, void 0, function () {
            var query, result, res;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("*** newInstance=", clientID, workflowID, stateID);
                        query = 'INSERT INTO instances (instance_id, workflow_id, client_id, current_state, state_data) VALUES ($1, $2, $3, $4, $5)';
                        return [4 /*yield*/, ((_a = this.dbClient) === null || _a === void 0 ? void 0 : _a.query(query, [(0, uuid_1.v4)(), workflowID, clientID, stateID, {}]))];
                    case 1:
                        result = _b.sent();
                        return [4 /*yield*/, this.getInstanceByID(clientID, workflowID)];
                    case 2:
                        res = _b.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    DefaultWorkflow.prototype.updateInstanceByID = function (clientID, workflowID, stateID, data) {
        return __awaiter(this, void 0, void 0, function () {
            var instance, query;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("*** updateInstance=", clientID, workflowID, stateID, data);
                        return [4 /*yield*/, this.getInstanceByID(clientID, workflowID)];
                    case 1:
                        instance = _b.sent();
                        query = "UPDATE instances SET current_state = $1, state_data = $2 WHERE workflow_id = $3 AND client_id = $4";
                        //console.log("query=", query);
                        //console.log("stateID=", stateID, " data=", data);
                        //console.log("workflowID=", stateID, " clientID=", clientID);
                        return [4 /*yield*/, ((_a = this.dbClient) === null || _a === void 0 ? void 0 : _a.query(query, [stateID, JSON.stringify(data), workflowID, clientID]))];
                    case 2:
                        //console.log("query=", query);
                        //console.log("stateID=", stateID, " data=", data);
                        //console.log("workflowID=", stateID, " clientID=", clientID);
                        _b.sent();
                        return [4 /*yield*/, this.getInstanceByID(clientID, workflowID)];
                    case 3:
                        instance = _b.sent();
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    return DefaultWorkflow;
}());
exports.DefaultWorkflow = DefaultWorkflow;
