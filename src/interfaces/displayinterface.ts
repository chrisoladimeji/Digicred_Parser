import { Workflow, Instance } from "./workflowinterface";

export interface IDisplay {
    processDisplay: (
        clientID: string, 
        curentWorkflow: Workflow, 
        instance: Instance, 
        currentState: string) => Promise<DisplayData>;
}

export interface DisplayData {
    displayData: any[]
}