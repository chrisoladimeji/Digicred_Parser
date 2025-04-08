import { Instance, IWorkflow, Workflow } from "./workflowinterface";
import { IAction, Transition } from "./actioninterface"


export interface IDisplayExtension {
    displays: (instance: Instance, template: any) => Promise<any>;
}