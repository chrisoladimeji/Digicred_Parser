import { Instance, IWorkflow, Workflow } from "./workflowinterface";
import { IAction, Transition } from "./actioninterface"


export interface IActionExtension {
    actions: (actionInput: any, instance: Instance, action: any, transtion: Transition) => Promise<[Transition, Instance]>;
}
