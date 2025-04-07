export interface IWorkflow {

    getWorkflowByID: (workflowID: string) => Promise<Workflow>;
    getInstanceByID: (workflowID: string, clientID: string) => Promise<Instance>;
    updateInstanceByID: (clientID: string, workflowID: string, stateID: string, data: any) => Promise<Instance>;
    newInstance: (clientID: string, workflowID: string, stateID: string, data: any) => Promise<Instance>;

}

export interface Workflow {
    workflow_id: string;
    name: string;
    initial_state: string;
    render: any[];
    states: [{state_id: string, display_data: any, actions: any, transitions: any}]
}

export interface Instance {
    instance_id: string;
    workflow_id: string;
    client_id: string,
    current_state: string;
    state_data: any;
}