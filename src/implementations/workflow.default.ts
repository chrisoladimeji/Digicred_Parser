import { Instance, IWorkflow, Workflow } from '../interfaces/workflowinterface'
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export class DefaultWorkflow implements IWorkflow {
    client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    async getWorkflowByID(workflowID: string): Promise<Workflow> {
        const res = await this.client.query('SELECT * FROM workflows WHERE "workflowID" = $1', [workflowID]);
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async getInstanceByID(workflowID: string, clientID: string): Promise<Instance> {
        let res = await this.client.query('SELECT * FROM instances WHERE "clientID" = $1 AND "workflowID" = $2', [clientID, workflowID]);
        if(res.rows.length === 0) {
            const workflow = await this.getWorkflowByID(workflowID);
            // Create new instance with new instanceID, the initial state fromt he workflow, and empoty instance data
            const query = 'INSERT INTO instances ("instanceID", "workflowID", "clientID", "currentState", "stateData") VALUES ($1, $2, $3, $4, $5)';
            res = await this.client.query(query, [uuidv4(), workflowID, clientID, workflow.initialState, {}]);
        }
        return res.rows.length > 0 ? res.rows[0] : null;
    }

}