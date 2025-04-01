import { IAction, Transition } from "../interfaces/actioninterface";
import { Instance, Workflow } from "../interfaces/workflowinterface";

export class DefaultAction implements IAction{

    
    async processAction(currentWorkflow: Workflow, instance: Instance, actionID: string): Promise<Transition>{
        // find the action 
        const action = currentWorkflow.states[instance.currentState].actions[actionID];
        
        switch(action.type) {
            case "stateData":
                // check condition
                // save the data from the action to the instance data
                break;
            case "transition":
                // check condition
                // set the transition condition
                break;
            default:
        }

        // start with a blank transition
        let transition:Transition = {    
            type: "",
            workflowID: "",
            stateID: ""
        };

        // check the transitions until the first true condition
        const transitions = currentWorkflow.states[instance.currentState].transitions;
        for(var i=0; i<transitions.length; i++ ) {
            // condition can use instance.stateData
            // check for first true condition
            if(eval(transitions[i])) {
                transition = transitions[i];
                break;
            }
        }

        return transition;
    }
}