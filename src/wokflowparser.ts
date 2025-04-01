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
        // get the workflow as JSON
        let curentWorkflow = await this.workflow.getWorkflowByID(action?.workflowID);

        // get the instance as JSON
        let instance = await this.workflow.getInstanceByID(clientID, action?.workflowID);

        // current state in the workflow
        let currentState = instance.currentState;

        // process the action
        let transition = await this.action.processAction(curentWorkflow, instance, action.actionID, this.workflow);

        if(transition.type != "") {
            // process the transition
            if(transition.type === 'workflow') {
                // get the new workflow
                curentWorkflow = await this.workflow.getWorkflowByID(transition?.workflowID);
                // get the new instance
                instance = await this.workflow.getInstanceByID(clientID, transition?.workflowID);
            }
            if(transition.type === 'state') {
                // set the new current state
                currentState = transition.stateID;
            }
        }

        // process the display
        const display = this.display.processDisplay(clientID, curentWorkflow, instance, currentState)

        // return workflowID and display
        return {workflowID: curentWorkflow.workflowID, displayData: display};
    }
}