import { IDisplay } from "./interfaces/displayinterface";
import { IAction } from "./interfaces/actioninterface";
import { IWorkflow } from "./interfaces/workflowinterface";

export class WorkflowParser {
    display: IDisplay;
    action: IAction;
    workflow: IWorkflow;

    constructor(
        display: IDisplay,
        action: IAction,
        workflow: IWorkflow
    ) {
        this.display = display;
        this.action = action;
        this.workflow = workflow;
    }

    async parse(
        clientID: string, 
        action: { 
            workflowID: string; 
            actionID: string; 
            data?: any }
    ): Promise<any> {
        console.log("=== parse clientID=", clientID, " action=", action);

        // get the workflow as JSON
        let curentWorkflow = await this.workflow.getWorkflowByID(action?.workflowID);
        console.log("+++ currentWorkflow=", curentWorkflow);

        // get the instance as JSON
        let instance = await this.workflow.getInstanceByID(clientID, action?.workflowID);
        console.log("+++ instance=", instance);

        // current state in the workflow
        let currentState = instance.current_state;

        // process the action
        let transition = await this.action.processAction(curentWorkflow, instance, action);
        console.log("+++ transition=", transition);

        if(transition.type != "none") {
            console.log("++ has transition")
            // process the transition
            if(transition.type === 'workflowTransition') {
                console.log("workflowTransition ", transition.workflow_id);
                // get the new workflow
                curentWorkflow = await this.workflow.getWorkflowByID(transition?.workflow_id);
                // get the new instance
                instance = await this.workflow.getInstanceByID(clientID, transition?.workflow_id);
                currentState = instance.current_state;

            }
            if(transition.type === 'stateTransition') {
                console.log("stateTransition ",  transition.state_id);
                // set the new current state
                currentState = transition.state_id;
                console.log("Chnaged to state=", currentState);
            }
        }

        // update the instance
        const updatedInstance = await this.workflow.updateInstanceByID(clientID, curentWorkflow.workflow_id, currentState, instance.state_data);
        console.log("+++ Updated instace=", updatedInstance);

        // process the display
        const display = await this.display.processDisplay(clientID, curentWorkflow, updatedInstance, currentState)

        // return workflowID and display
        return {workflowID: curentWorkflow.workflow_id, displayData: display.displayData};
    }
}