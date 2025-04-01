export interface IWorkflow {

    getWorkflowByID: (workflowID: string) => Promise<Workflow>;
    getInstanceByID: (workflowID: string, clientID: string) => Promise<Instance>;

}

export interface Workflow {
    workflowID: string;
    name: string;
    formatVersion: string;
    initialState: string;
    render: any[];
    states: [{stateID: string, displayData: any, actions: any, tranistions: any}]
}

export interface Instance {
    instanceID: string;
    workflowID: string;
    clientID: string,
    currentState: string;
    stateData: any;
}