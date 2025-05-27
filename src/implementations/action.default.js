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
exports.DefaultAction = void 0;
var DefaultAction = /** @class */ (function () {
    function DefaultAction(actionExtension) {
        this.actionExtension = actionExtension;
    }
    DefaultAction.prototype.processAction = function (currentWorkflow, instance, actionInput) {
        return __awaiter(this, void 0, void 0, function () {
            var transition, state, action, findtransition;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("*** processAction action=", actionInput);
                        transition = {
                            type: "none",
                            workflow_id: instance.workflow_id,
                            state_id: instance.current_state
                        };
                        if (!(actionInput.actionID != "")) return [3 /*break*/, 4];
                        state = currentWorkflow.states.find(function (item) { return item.state_id == instance.current_state; });
                        if (!(state.actions.length > 0)) return [3 /*break*/, 3];
                        action = state.actions.find(function (item) { return item.action_id == actionInput.actionID; });
                        if (!this.actionExtension) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.actionExtension.actions(actionInput, instance, action, transition)];
                    case 1:
                        _a = _b.sent(), transition = _a[0], instance = _a[1];
                        _b.label = 2;
                    case 2:
                        // handle the types of actions
                        switch (action === null || action === void 0 ? void 0 : action.type) {
                            case "saveData":
                                // check condition
                                if (eval(action.condition)) {
                                    // save the data from the workflow action to the instance data
                                    instance.state_data = Object.assign(instance.state_data, action.value);
                                }
                                break;
                            case "stateData":
                                // check condition
                                if (eval(action.condition)) {
                                    // save the data from the actionInput to the instance data
                                    instance.state_data = Object.assign(instance.state_data, actionInput.data);
                                }
                                break;
                            case "stateTransition":
                                // check condition
                                if (eval(action.condition)) {
                                    // set the transition condition for a new state
                                    transition.type = "stateTransition";
                                    transition.state_id = action.state_id;
                                }
                                break;
                            case "workflowTransition":
                                // check condition
                                if (eval(action.condition)) {
                                    // set the transition condition for a new workflow
                                    transition.type = "workflowTransition";
                                    transition.workflow_id = action.workflow_id;
                                }
                                break;
                            default:
                        }
                        _b.label = 3;
                    case 3:
                        findtransition = state.transitions.find(function (item) { return eval(item.condition); });
                        if (findtransition) {
                            transition = findtransition;
                        }
                        _b.label = 4;
                    case 4: return [2 /*return*/, [transition, instance]];
                }
            });
        });
    };
    return DefaultAction;
}());
exports.DefaultAction = DefaultAction;
