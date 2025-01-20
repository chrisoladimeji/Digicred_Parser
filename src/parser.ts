import { v4 as uuidv4 } from 'uuid';
import { ensureClient, getWorkflowByID, getWorkflowInstance, setWorkflowInstance, updateWorkflowInstanceByID } from "./dbCrud";

// Function to parse workflow action
export async function parse(connectionID: string, action: { workflowID: string; actionID: string; data?: any }): Promise<any> {
  await ensureClient();
  const { workflowID, actionID, data } = action;

  // Get the workflow
  const workflow = await getWorkflowByID(workflowID);
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  // Get the workflow instance
  let instance = await getWorkflowInstance(connectionID, workflowID);

  if (!instance) {
    // Create a new instance
    instance = {
      instanceID: uuidv4(),
      workflowID,
      connectionID,
      currentState: workflow.initialState,
      stateData: {},
    };
    await setWorkflowInstance(instance);
    console.log(`New instance created: ${instance.instanceID}`);
    // Send initial display data
    const initialState = workflow.states.find((state) => state.stateID === workflow.initialState);
    if (!initialState) {
      throw new Error('Initial state not found in workflow');
    }
    return {
      workflowID: workflow.workflowID,
      displayData: initialState.displayData,
    };
  }

  console.log("instance", instance);
  // console.log(`Existing instance found: ${instance.instanceID}`);

  // Find the current state
  const currentState = workflow.states.find((state) => state.stateID === instance.currentState);
  if (!currentState) {
    console.error(`Current state not found: ${instance.currentState}`);
    throw new Error('Current state not found in workflow');
  }
  console.log(`Current state: ${currentState.stateID}`);

  // Process the action if actionID is provided
  if (actionID) {
    const transition = currentState.transitions.find((t: { actionID: string }) => t.actionID === actionID);
    console.log("transition",transition)
    if (!transition) {
      console.error(`Action not found in current state transitions: ${actionID}`);
      // Return the current state's display data if action not found
      return {
        workflowID: workflow.workflowID,
        displayData: currentState.displayData,
      };
    }
    console.log(`Transition found: ${transition.actionID}`);

    // Check transition type and handle accordingly
    if (transition.type === 'workflow') {
      // Transition to a new workflow
      const newWorkflowID = transition.value;
      const newWorkflow = await getWorkflowByID(newWorkflowID);
      if (!newWorkflow) {
        console.log (`New workflow not found: ${newWorkflowID}`);
        return  {
          workflowID: `${newWorkflowID}`,
          displayData: [
            { text: 'Note: Workflow NOT found', type: 'title' },
            {
              text: 'We are working on it. Please explore other options. Type :menu to view home menu',
              type: 'text'
            }
          ],
        };
      }

      let newInstance = await getWorkflowInstance(connectionID, newWorkflowID);
      if (!newInstance) {
        // Create a new instance for the new workflow
        newInstance = {
          instanceID: uuidv4(),
          workflowID: newWorkflowID,
          connectionID,
          currentState: newWorkflow.initialState,
          stateData: {},
        };
        await setWorkflowInstance(newInstance);
        console.log(`New instance created for workflow ${newWorkflowID}: ${newInstance.instanceID}`);
      }

      // Find the current state
  const currentState = newWorkflow.states.find((state) => state.stateID === newInstance.currentState);
  if (!currentState) {
    console.error(`Current state not found: ${instance.currentState}`);
    throw new Error('Current state not found in workflow');
  }
  console.log(`Current state: ${currentState.stateID}`);
      return  {
        workflowID: newWorkflow.workflowID,
        displayData: currentState.displayData,
      };
    } else if (transition.type === 'state') {
      // Transition to a new state within the current workflow
      instance.currentState = transition.value;
      await updateWorkflowInstanceByID(instance.instanceID, instance);
      console.log(`Instance state updated: ${instance.currentState}`);

      // Send updated display data
      const nextState = workflow.states.find((state) => state.stateID === instance.currentState);
      if (!nextState) {
        console.error(`Next state not found: ${instance.currentState}`);
        throw new Error('Next state not found in workflow');
      }
      return {
        workflowID: workflow.workflowID,
        displayData: nextState.displayData,
      };
    } else {
      throw new Error(`Unknown transition type: ${transition.type}`);
    }
  } else {
    // If actionID is empty, return the current state's display data
    return {
      workflowID: workflow.workflowID,
      displayData: currentState.displayData,
    };
  }
}
