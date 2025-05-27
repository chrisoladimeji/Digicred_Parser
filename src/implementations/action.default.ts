import { IActionExtension } from "../interfaces/actionextension";
import { IAction, Transition } from "../interfaces/actioninterface";
import { Instance, Workflow } from "../interfaces/workflowinterface";

export class DefaultAction implements IAction{
    actionExtension: IActionExtension;

    constructor(actionExtension: IActionExtension) {
        this.actionExtension = actionExtension;
    }
    
    async processAction(currentWorkflow: Workflow, instance: Instance, actionInput: any): Promise<[Transition, Instance]>{
        console.log("*** processAction action=", actionInput);
        // start with a blank transition
        let transition:Transition = {    
            type: "none",
            workflow_id: instance.workflow_id,
            state_id: instance.current_state
        };

        if(actionInput.actionID!="") {
            // find the state
            const state = currentWorkflow.states.find(item => { return item.state_id == instance.current_state });
            // Only process actions if there are any
            if(state.actions.length>0) {
                const action = state.actions.find(item => { return item.action_id == actionInput.actionID })
                // handle the types of actions from the extension first
                if(this.actionExtension) {
                    [transition, instance] = await this.actionExtension.actions(actionInput, instance, action, transition)
                }
                // handle the types of actions
                switch(action?.type) {
                    case "saveData":
                        // check condition
                        if(eval(action.condition)) {
                            // save the data from the workflow action to the instance data
                            instance.state_data = Object.assign(instance.state_data, action.value);
                        }
                        break;
                    case "stateData":
                        // check condition
                        if(eval(action.condition)) {
                            // save the data from the actionInput to the instance data
                            instance.state_data = Object.assign(instance.state_data, actionInput.data);
                        }
                        break;
                    case "stateTransition":
                        // check condition
                        if(eval(action.condition)) {
                            // set the transition condition for a new state
                            transition.type = "stateTransition";
                            transition.state_id = action.state_id;
                        }
                        break;
                    case "workflowTransition":
                        // check condition
                        if(eval(action.condition)) {
                            // set the transition condition for a new workflow
                            transition.type = "workflowTransition";
                            transition.workflow_id = action.workflow_id;
                        }
                        break;
                    default:
                }
            }
            // check the transitions until the first true condition
            let findtransition = state.transitions.find(item => { return eval(item.condition) })
            if(findtransition) {
                transition = findtransition;
            }
        }
        return [transition, instance];
    }
}