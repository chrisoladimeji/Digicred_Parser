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
exports.DefaultDisplay = exports.DefaultAction = exports.DefaultWorkflow = exports.WorkflowParser = void 0;
var WorkflowParser = /** @class */ (function () {
    function WorkflowParser(display, action, workflow) {
        this.display = display;
        this.action = action;
        this.workflow = workflow;
    }
    WorkflowParser.prototype.parse = function (clientID, action) {
        return __awaiter(this, void 0, void 0, function () {
            var curentWorkflow, instance, currentState, _a, transition, newInstance, updatedInstance, display;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("=== parse clientID=", clientID, " action=", action);
                        return [4 /*yield*/, this.workflow.getWorkflowByID(action === null || action === void 0 ? void 0 : action.workflowID)];
                    case 1:
                        curentWorkflow = _b.sent();
                        console.log("+++ currentWorkflow");
                        return [4 /*yield*/, this.workflow.getInstanceByID(clientID, action === null || action === void 0 ? void 0 : action.workflowID)];
                    case 2:
                        instance = _b.sent();
                        console.log("+++ instance");
                        currentState = instance.current_state;
                        return [4 /*yield*/, this.action.processAction(curentWorkflow, instance, action)];
                    case 3:
                        _a = _b.sent(), transition = _a[0], newInstance = _a[1];
                        console.log("+++ transition");
                        Object.assign(instance, newInstance);
                        if (!(transition.type != "none")) return [3 /*break*/, 7];
                        if (!(transition.type === 'workflowTransition')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.workflow.getWorkflowByID(transition === null || transition === void 0 ? void 0 : transition.workflow_id)];
                    case 4:
                        // get the new workflow
                        curentWorkflow = _b.sent();
                        return [4 /*yield*/, this.workflow.getInstanceByID(clientID, transition === null || transition === void 0 ? void 0 : transition.workflow_id)];
                    case 5:
                        // get the new instance
                        instance = _b.sent();
                        currentState = instance.current_state;
                        _b.label = 6;
                    case 6:
                        if (transition.type === 'stateTransition') {
                            // set the new current state
                            currentState = transition.state_id;
                        }
                        _b.label = 7;
                    case 7: return [4 /*yield*/, this.workflow.updateInstanceByID(clientID, curentWorkflow.workflow_id, currentState, instance.state_data)];
                    case 8:
                        updatedInstance = _b.sent();
                        console.log("+++ Updated instance");
                        if (!(transition.type != "none-nodisplay")) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.display.processDisplay(clientID, curentWorkflow, updatedInstance, currentState)];
                    case 9:
                        display = _b.sent();
                        console.log("+++ Processed display");
                        return [2 /*return*/, { workflowID: curentWorkflow.workflow_id, displayData: display === null || display === void 0 ? void 0 : display.displayData }];
                    case 10:
                        console.log("+++ Skip display");
                        return [2 /*return*/, { workflowID: curentWorkflow.workflow_id }];
                }
            });
        });
    };
    return WorkflowParser;
}());
exports.WorkflowParser = WorkflowParser;
var workflow_default_1 = require("./implementations/workflow.default");
Object.defineProperty(exports, "DefaultWorkflow", { enumerable: true, get: function () { return workflow_default_1.DefaultWorkflow; } });
var action_default_1 = require("./implementations/action.default");
Object.defineProperty(exports, "DefaultAction", { enumerable: true, get: function () { return action_default_1.DefaultAction; } });
var display_default_1 = require("./implementations/display.default");
Object.defineProperty(exports, "DefaultDisplay", { enumerable: true, get: function () { return display_default_1.DefaultDisplay; } });
