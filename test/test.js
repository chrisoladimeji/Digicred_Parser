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
var workflowparser_1 = require("../src/workflowparser");
var display_default_1 = require("../src/implementations/display.default");
var action_default_1 = require("../src/implementations/action.default");
var workflow_default_1 = require("../src/implementations/workflow.default");
var pg_1 = require("pg");
var testWorkflows = require("./testworkflows.json");
var testClient = new pg_1.Client({
    user: 'admin',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'test_workflows'
});
connectDatabase(testClient);
dropTable(testClient, "workflows");
dropTable(testClient, "instances");
addTable(testClient, "CREATE TABLE workflows (\n        workflow_id VARCHAR(255) PRIMARY KEY, \n        name VARCHAR(255),\n        initial_state VARCHAR(255),\n        render JSONB,\n        states JSONB\n    );");
addTable(testClient, "CREATE TABLE instances (\n        instance_id UUID PRIMARY KEY,\n        workflow_id VARCHAR(255),\n        client_id VARCHAR(255), \n        current_state VARCHAR(255),\n        state_data JSONB\n    );");
insertWorkflows(testClient);
var defaultWorkflow = new workflow_default_1.DefaultWorkflow(testClient);
var defaultAction = new action_default_1.DefaultAction();
var defaultDisplay = new display_default_1.DefaultDisplay();
var testParser = new workflowparser_1.WorkflowParser(defaultDisplay, defaultAction, defaultWorkflow);
function connectDatabase(dbClient) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            dbClient.connect();
            return [2 /*return*/];
        });
    });
}
function dropTable(dbClient, table) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("*** Drop Table - ", table);
                    return [4 /*yield*/, dbClient.query('DROP TABLE IF EXISTS ' + table + ';')];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log("Drop workflows error=", error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function addTable(dbClient, tableSql) {
    return __awaiter(this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log("*** Create Tables");
                    return [4 /*yield*/, dbClient.query(tableSql)];
                case 1:
                    result = _a.sent();
                    console.log(result);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log("Drop table error=", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function insertWorkflows(dbClient) {
    return __awaiter(this, void 0, void 0, function () {
        var query, _i, _a, workflow;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("*** Insert Workflows");
                    query = 'INSERT INTO workflows (workflow_id, name, initial_state, render, states) VALUES ($1, $2, $3, $4, $5)';
                    _i = 0, _a = testWorkflows.workflows;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    workflow = _a[_i];
                    console.log("Inserting workflow:", workflow);
                    console.log("Inserting workflowID:", workflow.workflow_id);
                    return [4 /*yield*/, dbClient.query(query, [
                            workflow.workflow_id,
                            workflow.name,
                            workflow.initial_state,
                            JSON.stringify(workflow.render),
                            JSON.stringify(workflow.states)
                        ])];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function runtests() {
    return __awaiter(this, void 0, void 0, function () {
        var display;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("~~~ Start Test 1 - Load default workflow and state");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "", data: {} })];
                case 1:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 2 - go to Page1");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "nextButton", data: {} })];
                case 2:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 3 - return from Page1 to menu");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "backButton", data: {} })];
                case 3:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 4 - go to page 2");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "dataButton", data: {} })];
                case 4:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 5 - save fixed data");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "saveButton", data: {} })];
                case 5:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 6 - save mobile data");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "stateButton", data: { "Date": "Today" } })];
                case 6:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 7 - return to menu");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "backButton", data: {} })];
                case 7:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 8 - go to new workflow");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "workflowButton", data: {} })];
                case 8:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 9 - go back to root-menu workflow");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "other-menu", actionID: "homeButton", data: {} })];
                case 9:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 10 - go to new workflow");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "root-menu", actionID: "workflowButton", data: {} })];
                case 10:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    console.log("~~~ Start Test 11 - return to root-menu workflow");
                    return [4 /*yield*/, testParser.parse("TestPersonID", { workflowID: "other-menu", actionID: "noactionButton", data: {} })];
                case 11:
                    display = _a.sent();
                    console.log("Returns displaydata= %j", display);
                    return [2 /*return*/];
            }
        });
    });
}
// start test
runtests();
