import { IDisplay } from "./interfaces/displayinterface";
import { IAction } from "./interfaces/actioninterface";
import { IWorkflow } from "./interfaces/workflowinterface";
import { IActionExtension } from "./interfaces/actionextension";
import { IDisplayExtension } from "./interfaces/displayextension";
import { Transition } from './interfaces/actioninterface';
import { Instance } from './interfaces/workflowinterface';
import { Workflow } from './interfaces/workflowinterface';

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
        console.log("+++ currentWorkflow");

        // get the instance as JSON
        let instance = await this.workflow.getInstanceByID(clientID, action?.workflowID);
        console.log("+++ instance");

        // current state in the workflow
        let currentState = instance.current_state;

        // process the action
        let [transition, newInstance] = await this.action.processAction(curentWorkflow, instance, action);
        console.log("+++ transition");
        Object.assign(instance, newInstance);

        if(transition.type != "none") {
            // process the transition
            if(transition.type === 'workflowTransition') {
                // get the new workflow
                curentWorkflow = await this.workflow.getWorkflowByID(transition?.workflow_id);
                // get the new instance
                instance = await this.workflow.getInstanceByID(clientID, transition?.workflow_id);
                currentState = instance.current_state;
            }
            if(transition.type === 'stateTransition') {
                // set the new current state
                currentState = transition.state_id;
            }
        }

        // update the instance
        const updatedInstance = await this.workflow.updateInstanceByID(clientID, curentWorkflow.workflow_id, currentState, instance.state_data);
        console.log("+++ Updated instance");

        if(transition.type != "none-nodisplay") {
            // process the display
            const display = await this.display.processDisplay(clientID, curentWorkflow, updatedInstance, currentState)
            console.log("+++ Processed display");
            return {workflowID: curentWorkflow.workflow_id, displayData: display?.displayData};
        }
        else {
            console.log("+++ Skip display");
            return {workflowID: curentWorkflow.workflow_id};
        }

        // return workflowID and display
    }
}

export { DefaultWorkflow } from './implementations/workflow.default';
export { DefaultAction } from './implementations/action.default';
export { DefaultDisplay } from './implementations/display.default';
export { IActionExtension, IDisplayExtension };
export { Transition, Instance, Workflow };