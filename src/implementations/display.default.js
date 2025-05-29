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
exports.DefaultDisplay = void 0;
var DefaultDisplay = /** @class */ (function () {
    function DefaultDisplay(displayExtension) {
        this.displayExtension = displayExtension;
    }
    DefaultDisplay.prototype.processDisplay = function (clientID, curentWorkflow, instance, currentState) {
        return __awaiter(this, void 0, void 0, function () {
            var displayData, display, displayTemplate, i, newValue;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        console.log("*** processDisplay");
                        displayData = { displayData: [] };
                        display = curentWorkflow.states.find(function (item) { return item.state_id == currentState; });
                        displayTemplate = display.display_data;
                        i = 0;
                        _b.label = 1;
                    case 1:
                        if (!(i < displayTemplate.length)) return [3 /*break*/, 5];
                        // condition can use instance.stateData
                        if ((_a = displayTemplate[i]) === null || _a === void 0 ? void 0 : _a.condition) {
                            if (!eval(displayTemplate[i].condition)) {
                                return [3 /*break*/, 4]; // don't process if condition not met
                            }
                        }
                        if (!this.displayExtension) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.displayExtension.displays(instance, displayTemplate[i])];
                    case 2:
                        newValue = _b.sent();
                        if (newValue) {
                            displayTemplate[i] = newValue;
                        }
                        _b.label = 3;
                    case 3:
                        switch (displayTemplate[i].type) {
                            case "text":
                                displayTemplate[i].text = this.parseString(displayTemplate[i].text, instance.state_data);
                                break;
                            case "title":
                                displayTemplate[i].text = this.parseString(displayTemplate[i].text, instance.state_data);
                                break;
                            case "warning":
                                displayTemplate[i].text = this.parseString(displayTemplate[i].text, instance.state_data);
                                break;
                            case "information":
                                displayTemplate[i].text = this.parseString(displayTemplate[i].text, instance.state_data);
                                break;
                            case "quote":
                                displayTemplate[i].text = this.parseString(displayTemplate[i].text, instance.state_data);
                                break;
                            case "text-field":
                                displayTemplate[i].value = this.parseString(displayTemplate[i].value, instance.state_data);
                                break;
                            case "text-area":
                                displayTemplate[i].value = this.parseString(displayTemplate[i].value, instance.state_data);
                                break;
                            case "drop-down":
                                displayTemplate[i].value = this.parseString(displayTemplate[i].value, instance.state_data);
                                break;
                            case "radio-button":
                                displayTemplate[i].default = this.parseString(displayTemplate[i].value, instance.state_data);
                                break;
                            case "check-box":
                                displayTemplate[i].default = this.parseString(displayTemplate[i].value, instance.state_data);
                                break;
                            case "control":
                                displayTemplate[i].text = this.parseString(displayTemplate[i].text, instance.state_data);
                                break;
                        }
                        displayData.displayData.push(displayTemplate[i]);
                        _b.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, displayData];
                }
            });
        });
    };
    DefaultDisplay.prototype.parseString = function (text, data) {
        // Split out the string
        var parts = text.split(/[{,}]/);
        // check every other string segment looking for a key in data
        // Text for parsing should not start with a variable "{variable} hello!"
        // *** repalce this code with a more comprehensive parser
        for (var i = 1; i < parts.length; i += 2) {
            // find this value in the data
            var value = this.findNode(parts[i], data);
            if (value) {
                // if there is a value, replace the entry
                parts[i] = value;
            }
            else {
                // if there is no current value, replace the {field} with blank ""
                parts[i] = "";
            }
        }
        // put the string back together again
        return parts.join("");
    };
    DefaultDisplay.prototype.findNode = function (id, currentNode) {
        var currentChild, result;
        if (id in currentNode) {
            return currentNode[id];
        }
        else {
            // use a for loop instead of forEach to avoid nested functions
            // otherwise "return" will not work properly
            for (var i = 0; currentNode.children !== undefined; i += 1) {
                currentChild = currentNode.children[i];
                // Search in the current child
                result = this.findNode(id, currentChild);
                // Return the result if the node has been found
                if (result !== false) {
                    return result;
                }
            }
            // the node has not been found and we have no more options
            return false;
        }
    };
    return DefaultDisplay;
}());
exports.DefaultDisplay = DefaultDisplay;
