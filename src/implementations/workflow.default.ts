import { Instance, IWorkflow, Workflow } from '../interfaces/workflowinterface'
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

export class DefaultWorkflow implements IWorkflow {
    dbClient: Client;

    constructor(dbClient: any) {
        console.log("DefaultWorkflow constructor dbCLient=", dbClient);
        this.dbClient = new Client(dbClient);
        this.connectDB();
    }

    async connectDB() {
        await this.dbClient.connect();
        console.log("Database connected");
    }

    async getWorkflowByID(workflowID: string): Promise<Workflow> {
        console.log("*** getWorkflowByID");
        const res = await this.dbClient?.query('SELECT * FROM workflows WHERE "workflow_id" = $1', [workflowID]);
        //console.log("WorkflowID=", workflowID);
        //console.log("Workflow=", res.rows[0]);
        return res.rows.length > 0 ? res.rows[0] : null;
    }

    async getInstanceByID(clientID: string, workflowID: string): Promise<Instance> {
        console.log("*** getInstanceByID");
        let instance = null;
        let query = 'SELECT * FROM instances WHERE "client_id" = $1 AND "workflow_id" = $2';
        let res = await this.dbClient?.query(query, [clientID, workflowID]);
        //console.log("Look for existing instance clientID=", clientID, " workflowID=", workflowID);
        //console.log("Found ", res.rows);
        if(res.rows.length === 0) {
            // no instance
            //console.log("getInstanceByID - no instance");
            const workflow = await this.getWorkflowByID(workflowID);
            // Create new instance with new instanceID, the initial state fromt he workflow, and empoty instance data
            instance = await this.newInstance(clientID, workflowID, workflow.initial_state);
        }
        else {
            instance = res.rows.length > 0 ? res.rows[0] : null;
        }

        //console.log("Instance=",  instance);
        return instance;
    }

    async newInstance(clientID: string, workflowID: string, stateID: string): Promise<Instance> {
        console.log("*** newInstance=", clientID, workflowID, stateID);
        const query = 'INSERT INTO instances (instance_id, workflow_id, client_id, current_state, state_data) VALUES ($1, $2, $3, $4, $5)';
        let result = await this.dbClient?.query(query, [uuidv4(), workflowID, clientID, stateID, {}]);
        let res = await this.getInstanceByID(clientID, workflowID);
        return res;
    }

    async updateInstanceByID(clientID: string, workflowID: string, stateID: string, data: any): Promise<Instance> {
        console.log("*** updateInstance=", clientID, workflowID, stateID, data);
        // check instance and create new if does not exist
        let instance = await this.getInstanceByID(clientID, workflowID);
        // update current_state and state_data
        const query = "UPDATE instances SET current_state = $1, state_data = $2 WHERE workflow_id = $3 AND client_id = $4";
        //console.log("query=", query);
        //console.log("stateID=", stateID, " data=", data);
        //console.log("workflowID=", stateID, " clientID=", clientID);
        await this.dbClient?.query(query, [stateID, JSON.stringify(data), workflowID, clientID]);
        instance = await this.getInstanceByID(clientID, workflowID);
        return instance;
    }

}