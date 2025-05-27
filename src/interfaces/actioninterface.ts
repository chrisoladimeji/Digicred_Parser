import { Instance, IWorkflow, Workflow } from "./workflowinterface";

export interface IAction {
    processAction: (currentWorkflow: Workflow, instance: Instance, action: any) => Promise<[Transition, Instance]>;
}

export interface Transition {
    type: string,
    workflow_id: string,
    state_id: string
}