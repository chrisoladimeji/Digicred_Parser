CREATE TABLE workflows (
  workflowID VARCHAR(255) PRIMARY KEY, 
  name VARCHAR(255),
  formatVersion VARCHAR(50),
  initialState VARCHAR(255),
  render JSONB,
  states JSONB
);

CREATE TABLE instances (
  instanceID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflowID VARCHAR(255),
  clientID VARCHAR(255), 
  connectionID VARCHAR(255),
  currentState VARCHAR(255),
  stateData JSONB
);