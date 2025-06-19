// __tests__/parser.unit.spec.ts
import { parseWorkflow } from '../src/index';

// 1) Stub out DefaultWorkflow so no DB calls
jest.mock('../src/implementations/workflow.default', () => ({
  DefaultWorkflow: jest.fn().mockImplementation(() => ({
    getWorkflowByID: jest.fn().mockResolvedValue({
      workflowID: 'wf1',
      actionID:   'noop',
      data:       { foo: 'bar' }
    })
  }))
}));

// 2) Stub out DefaultAction
jest.mock('../src/implementations/action.default', () => ({
  DefaultAction: jest.fn().mockImplementation(() => ({
    execute: jest.fn().mockResolvedValue({
      workflowID: 'wf1',
      actionID:   'noop',
      data:       { foo: 'bar' }
    })
  }))
}));

// 3) Stub out DefaultDisplay
jest.mock('../src/implementations/display.default', () => ({
  DefaultDisplay: jest.fn().mockImplementation(() => ({
    render: jest.fn().mockReturnValue({
      displayData: [ { type: 'text', text: 'Rendered!' } ],
      workflowID:  'wf1'
    })
  }))
}));

describe('parseWorkflow()', () => {
  it('instantiates defaults and returns the rendered payload', async () => {
    const opts = { workflowID: 'wf1', actionID: 'noop', data: { foo: 'bar' } };
    const result = await parseWorkflow(opts);

    // verify constructors were called
    const { DefaultWorkflow } = await import('../src/implementations/workflow.default');
    const { DefaultAction }   = await import('../src/implementations/action.default');
    const { DefaultDisplay }  = await import('../src/implementations/display.default');
    expect(DefaultWorkflow).toHaveBeenCalledTimes(1);
    expect(DefaultAction).toHaveBeenCalledTimes(1);
    expect(DefaultDisplay).toHaveBeenCalledTimes(1);

    // assert on the final return shape
    expect(result).toEqual({
      displayData: [ { type: 'text', text: 'Rendered!' } ],
      workflowID:  'wf1'
    });
  });
});
