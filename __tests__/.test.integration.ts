// __tests__/.test.ts
import { parseWorkflow } from '../src/index';

// Mock DefaultWorkflow to avoid real DB calls
jest.mock('../src/implementations/workflow.default', () => ({
  DefaultWorkflow: jest.fn().mockImplementation(() => ({
    getWorkflowByID: jest.fn().mockResolvedValue({
      workflowID: 'wf1',
      actionID: 'noop',
      data: { foo: 'bar' }
    })
  }))
}));

// Mock DefaultAction to bypass business logic
jest.mock('../src/implementations/action.default', () => ({
  DefaultAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({
      workflowID: 'wf1',
      actionID: 'noop',
      data: { foo: 'bar' }
    })
  }))
}));

// Mock DefaultDisplay to bypass rendering logic
jest.mock('../src/implementations/display.default', () => ({
  DefaultDisplay: jest.fn().mockImplementation(() => ({
    render: jest.fn().mockReturnValue({
      displayData: [
        { type: 'text', text: 'Rendered!' }
      ],
      workflowID: 'wf1'
    })
  }))
}));

describe('WorkflowParser Unit Test', () => {
  it('should parse workflow and render displayData', async () => {
    const opts = { workflowID: 'wf1', actionID: 'noop', data: { foo: 'bar' } };
    const result = await parseWorkflow(opts);

    // verify mocks were instantiated
    const { DefaultWorkflow } = await import('../src/implementations/workflow.default');
    const { DefaultAction }   = await import('../src/implementations/action.default');
    const { DefaultDisplay }  = await import('../src/implementations/display.default');
    expect(DefaultWorkflow).toHaveBeenCalled();
    expect(DefaultAction).toHaveBeenCalled();
    expect(DefaultDisplay).toHaveBeenCalled();

    // assert on the final rendered output
    expect(result).toEqual({
      displayData: [ { type: 'text', text: 'Rendered!' } ],
      workflowID: 'wf1'
    });
  });
});
