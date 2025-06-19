// src/index.ts
import 'reflect-metadata';

import { DefaultWorkflow } from './implementations/workflow.default';
import { DefaultAction }   from './implementations/action.default';
import { DefaultDisplay }  from './implementations/display.default';

/**
 * Core parsing class: can be constructed with custom extensions,
 * or will fall back to default implementations (including DB config).
 */
export class WorkflowParser {
  private workflow;
  private actionExtension;
  private displayExtension;

  constructor(
    workflow?,
    actionExtension?,
    displayExtension?
  ) {
    // Load DB config from env or use default settings
    const dbConfig = process.env.DB_CONFIG
      ? JSON.parse(process.env.DB_CONFIG)
      : {
          user: 'admin',
          password: 'root',
          host: 'localhost',
          port: 5432,
          database: 'workflow'
        };

    this.workflow = workflow         ?? new DefaultWorkflow(dbConfig);
    this.actionExtension  = actionExtension  ?? new DefaultAction({} as any);
    this.displayExtension = displayExtension ?? new DefaultDisplay({} as any);
  }

  /**
   * Parses a workflow for a given client, action, and data.
   */
  async parse(
    clientID: string,
    opts: { workflowID: string; actionID: string; data: any }
  ) {
    const instance     = await this.workflow.getWorkflowByID(opts.workflowID);
    const actionResult = await this.actionExtension.execute(
      instance,
      opts.actionID,
      opts.data
    );
    return this.displayExtension.render(actionResult);
  }
}

/**
 * Convenience helper: instantiate a parser with defaults and run parse().
 */
export async function parseWorkflow(
  opts: { workflowID: string; actionID: string; data: any },
  clientID = 'test-client'
) {
  const parser = new WorkflowParser();
  return parser.parse(clientID, opts);
}

// Re-export core implementations
export { DefaultWorkflow, DefaultAction, DefaultDisplay };
