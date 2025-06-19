// __tests__/.test.ts
import 'reflect-metadata';
import { WorkflowParser }  from '../src/index';
import { DefaultWorkflow } from '../src/implementations/workflow.default';
import { DefaultAction }   from '../src/implementations/action.default';
import { DefaultDisplay }  from '../src/implementations/display.default';
import { Client }          from 'pg';
import { v4 as uuidv4 }    from 'uuid';
import * as testWorkflows  from './testworkflows.json';

// Database connection config for tests
afterAllCleanup: false
const clientConfig = {
  user: 'admin',
  password: 'root',
  host: 'localhost',
  port: 5432,
  database: 'test_workflows'
};

// Instantiate default implementations without extensions
const defaultWorkflow = new DefaultWorkflow(clientConfig);
const defaultAction   = new DefaultAction({} as any);
const defaultDisplay  = new DefaultDisplay({} as any);

// Correct argument order: (workflow, action, display)
const testParser = new WorkflowParser(
  defaultWorkflow,
  defaultAction,
  defaultDisplay
);

describe.skip('WorkflowParser Integration Tests', () => {
  beforeAll(async () => {
    const dbClient = new Client(clientConfig);
    await dbClient.connect();

    // Drop existing tables
    await dbClient.query('DROP TABLE IF EXISTS instances;');
    await dbClient.query('DROP TABLE IF EXISTS workflows;');

    // Create workflows table
    await dbClient.query(`
      CREATE TABLE workflows (
        workflow_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255),
        initial_state VARCHAR(255),
        render JSONB,
        states JSONB
      );
    `);

    // Create instances table
    await dbClient.query(`
      CREATE TABLE instances (
        instance_id UUID PRIMARY KEY,
        workflow_id VARCHAR(255),
        client_id VARCHAR(255),
        current_state VARCHAR(255),
        state_data JSONB
      );
    `);

    // Insert and seed
    const insertWF = 'INSERT INTO workflows(workflow_id, name, initial_state, render, states) VALUES($1,$2,$3,$4,$5)';
    const insertInst = 'INSERT INTO instances(instance_id, workflow_id, client_id, current_state, state_data) VALUES($1,$2,$3,$4,$5)';
    for (const wf of testWorkflows.workflows) {
      await dbClient.query(insertWF, [
        wf.workflow_id,
        wf.name,
        wf.initial_state,
        JSON.stringify(wf.render),
        JSON.stringify(wf.states)
      ]);
      await dbClient.query(insertInst, [
        uuidv4(),
        wf.workflow_id,
        'TestPersonID',
        wf.initial_state,
        JSON.stringify({})
      ]);
    }

    await dbClient.end();
  });

  it('Get the default state from the workflow', async () => {
    const display = await testParser.parse('TestPersonID', {
      workflowID: 'root-menu', actionID: '', data: {}
    });
    expect(display.workflowID).toBe('root-menu');
  });

  it('Got to page1', async () => {
    const display = await testParser.parse('TestPersonID', {
      workflowID: 'root-menu', actionID: 'nextButton', data: {}
    });
    expect(display.actionID).toBe('nextButton');
  });
});
