import clientPromise from './db';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface Workflow {
  workflowID: string;
  name: string;
  formatVersion: string;
  initialState: string;
  render: any[];
  states: any[];
}

export interface Instance {
  instanceID: string;
  workflowID: string;
  connectionID: string;
  currentState: string;
  stateData: any;
}

let client: any;

// Ensure client is initialized
export const ensureClient = async () => {
  if (!client) {
    client = await clientPromise;
  }
};

// Function to check if a workflow exists by ID
export async function workflowExists(workflowID: string): Promise<boolean> {
  await ensureClient();
  const res = await client.query('SELECT 1 FROM workflows WHERE "workflowID" = $1', [workflowID]);
  return res.rowCount > 0;
}

export async function setWorkflows(workflows: Workflow[]): Promise<void> {
  await ensureClient();
  const query = 'INSERT INTO workflows ("workflowID", name, "formatVersion", "initialState", render, states) VALUES ($1, $2, $3, $4, $5, $6)';

  for (const workflow of workflows) {
    const exists = await workflowExists(workflow.workflowID);
    if (exists) {
      console.log(`Workflow ${workflow.workflowID} already exists. Skipping insertion.`);
      continue;
    }
    console.log("Inserting workflow:", workflow);
    await client.query(query, [
      workflow.workflowID,
      workflow.name,
      workflow.formatVersion,
      workflow.initialState,
      JSON.stringify(workflow.render),
      JSON.stringify(workflow.states)
    ]);
  }
}

// Function to get all workflows
export async function getWorkflows(): Promise<Workflow[]> {
  await ensureClient();
  const res = await client.query('SELECT * FROM workflows');
  return res.rows;
}

// Function to get workflow by ID
export async function getWorkflowByID(workflowID: string): Promise<Workflow> {
  await ensureClient();
  const res = await client.query('SELECT * FROM workflows WHERE "workflowID" = $1', [workflowID]);
  return res.rows[0];
}

// Function to update workflow by ID
export async function updateWorkflowByID(workflowID: string, workflow: Workflow): Promise<void> {
  await ensureClient();
  const query = 'UPDATE workflows SET name = $1, "formatVersion" = $2, "initialState" = $3, render = $4, states = $5 WHERE "workflowID" = $6';
  await client.query(query, [workflow.name, workflow.formatVersion, workflow.initialState, workflow.render, workflow.states, workflowID]);
}

// Function to delete workflow by ID
export async function deleteWorkflowByID(workflowID: string): Promise<void> {
  await ensureClient();
  await client.query('DELETE FROM workflows WHERE "workflowID" = $1', [workflowID]);
}

// Function to delete all workflows
export async function deleteWorkflows(): Promise<void> {
  await ensureClient();
  await client.query('DELETE FROM workflows');
}

// Function to set workflow instance
export async function setWorkflowInstance(instance: Instance): Promise<void> {
  await ensureClient();
  const query = 'INSERT INTO instances ("instanceID", "workflowID", "connectionID", "currentState", "stateData") VALUES ($1, $2, $3, $4, $5)';
  await client.query(query, [instance.instanceID, instance.workflowID, instance.connectionID, instance.currentState, instance.stateData]);
}

// Function to get all workflow instances
export async function getWorkflowInstances(): Promise<Instance[]> {
  await ensureClient();
  const res = await client.query('SELECT * FROM instances');
  return res.rows;
}

// Function to get workflow instance by ID
export async function getWorkflowInstanceByID(instanceID: string): Promise<Instance> {
  await ensureClient();
  const res = await client.query('SELECT * FROM instances WHERE "instanceID" = $1', [instanceID]);
  return res.rows[0];
}

// Function to get workflow instance by connection ID and workflow ID
export async function getWorkflowInstance(connectionID: string, workflowID: string): Promise<Instance | null> {
  await ensureClient();
  const res = await client.query('SELECT * FROM instances WHERE "connectionID" = $1 AND "workflowID" = $2', [connectionID, workflowID]);
  return res.rows.length > 0 ? res.rows[0] : null;
}

// Function to update workflow instance by ID
export async function updateWorkflowInstanceByID(instanceID: string, instance: Instance): Promise<void> {
  await ensureClient();
  const query = 'UPDATE instances SET "workflowID" = $1, "connectionID" = $2, "currentState" = $3, "stateData" = $4 WHERE "instanceID" = $5';
  await client.query(query, [instance.workflowID, instance.connectionID, instance.currentState, instance.stateData, instanceID]);
}

// Function to delete workflow instance by ID
export async function deleteWorkflowInstanceByID(instanceID: string): Promise<void> {
  await ensureClient();
  await client.query('DELETE FROM instances WHERE "instanceID" = $1', [instanceID]);
}

// Function to delete all workflow instances
export async function deleteWorkflowInstances(): Promise<void> {
  await ensureClient();
  await client.query('DELETE FROM instances');
}

// Function to initialize the database schema
export async function initDb() {
  await ensureClient();
  try {
    const schema = readFileSync(join(__dirname, 'schema.sql')).toString();
    await client.query(schema);
    console.log('Database initialized');
  } catch (error: any) {
    if (error.code === '42P07') {
      console.log('Database already initialized');
    } else {
      console.error('Error initializing database', error);
    }
  }
}

export async function loadWorkflowsFromFile(filePath: string): Promise<void> {
  await ensureClient();
  try {
    const workflowsData = readFileSync(filePath, 'utf-8');
    const workflows = JSON.parse(workflowsData);
    let insertedCount = 0;
    let skippedCount = 0;

    for (const workflow of workflows) {
      const exists = await workflowExists(workflow.workflowID);
      if (exists) {
        console.log(`Workflow ${workflow.workflowID} already exists. Skipping insertion.`);
        skippedCount++;
      } else {
        console.log(`Inserting workflow: ${JSON.stringify(workflow)}`);
        await client.query('INSERT INTO workflows ("workflowID", name, "formatVersion", "initialState", render, states) VALUES ($1, $2, $3, $4, $5, $6)', [
          workflow.workflowID,
          workflow.name,
          workflow.formatVersion,
          workflow.initialState,
          JSON.stringify(workflow.render),
          JSON.stringify(workflow.states)
        ]);
        insertedCount++;
      }
    }

    console.log(`Workflows loaded successfully. Inserted: ${insertedCount}, Skipped: ${skippedCount}`);
  } catch (error: any) {
    console.error('Error loading workflows from file:', error.message);
  }
}

// Function to load workflows from JSON content
export async function loadWorkflowsFromJson(jsonContent: string): Promise<void> {
  await ensureClient();
  const workflows = JSON.parse(jsonContent);
  await setWorkflows(workflows);
}
