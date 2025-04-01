import { Instance, IWorkflow, Workflow } from "./workflowinterface";

export interface IAction {
    processAction: (currentWorkflow: Workflow, instance: Instance, actionID: string, workflow: IWorkflow) => Promise<Transition>;
}

export interface Transition {
    type: string,
    workflowID: string,
    stateID: string
}