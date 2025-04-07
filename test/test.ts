import { WorkflowParser } from '../src/workflowparser';
import { DefaultDisplay } from '../src/implementations/display.default';
import { DefaultAction } from '../src/implementations/action.default';
import { DefaultWorkflow } from '../src/implementations/workflow.default';
import { Client } from 'pg';
import * as testWorkflows from './testworkflows.json'

const testClient = new Client({
    user: 'admin',
    password: 'root',
    host: 'localhost',
    port: 5432,
    database: 'test_workflows'
})

connectDatabase(testClient);

dropTable(testClient, "workflows");
dropTable(testClient, "instances");

addTable(testClient, 
    `CREATE TABLE workflows (
        workflow_id VARCHAR(255) PRIMARY KEY, 
        name VARCHAR(255),
        initial_state VARCHAR(255),
        render JSONB,
        states JSONB
    );`
)

addTable(testClient, 
    `CREATE TABLE instances (
        instance_id UUID PRIMARY KEY,
        workflow_id VARCHAR(255),
        client_id VARCHAR(255), 
        current_state VARCHAR(255),
        state_data JSONB
    );`
);

insertWorkflows(testClient);

const defaultWorkflow = new DefaultWorkflow(testClient);
const defaultAction = new DefaultAction();
const defaultDisplay = new DefaultDisplay();

const testParser = new WorkflowParser(defaultDisplay, defaultAction, defaultWorkflow);

async function connectDatabase(dbClient: Client): Promise<void>{
    dbClient.connect()
}

async function dropTable(dbClient: Client, table: string): Promise<void> {
    try {
        console.log("*** Drop Table - ", table);
        const result = await dbClient.query('DROP TABLE IF EXISTS ' + table + ';');
        console.log(result);
    }
    catch(error) {
        console.log("Drop workflows error=", error);
    }
}

async function addTable(dbClient: Client, tableSql: string): Promise<void> {
    try {
        console.log("*** Create Tables");
        const result = await dbClient.query(tableSql);
        console.log(result);
    }
    catch(error) {
        console.log("Drop table error=", error);
    }
}

async function insertWorkflows(dbClient: Client): Promise<void> {
    console.log("*** Insert Workflows");
    const query = 'INSERT INTO workflows (workflow_id, name, initial_state, render, states) VALUES ($1, $2, $3, $4, $5)';
    for (const workflow of testWorkflows.workflows) {
      console.log("Inserting workflow:", workflow);
      console.log("Inserting workflowID:", workflow.workflow_id);
      await dbClient.query(query, [
        workflow.workflow_id,
        workflow.name,
        workflow.initial_state,
        JSON.stringify(workflow.render),
        JSON.stringify(workflow.states)
      ]);
    } 
}


async function runtests(): Promise<void> {
    console.log("~~~ Start Test 1 - Load default workflow and state");
    let display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 2 - go to Page1");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "nextButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 3 - return from Page1 to menu");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "backButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 4 - go to page 2");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "dataButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 5 - save fixed data");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "saveButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 6 - save mobile data");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "stateButton", data: {"Date": "Today"} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 7 - return to menu");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "backButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 8 - go to new workflow");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "workflowButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 9 - go back to root-menu workflow");
    display = await testParser.parse("TestPersonID", {workflowID: "other-menu", actionID: "homeButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 10 - go to new workflow");
    display = await testParser.parse("TestPersonID", {workflowID: "root-menu", actionID: "workflowButton", data: {} });
    console.log("Returns displaydata= %j", display);

    console.log("~~~ Start Test 11 - return to root-menu workflow");
    display = await testParser.parse("TestPersonID", {workflowID: "other-menu", actionID: "noactionButton", data: {} });
    console.log("Returns displaydata= %j", display);

}

// start test
runtests();


