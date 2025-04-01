CREATE TABLE workflows (
  "workflowID" VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  "formatVersion" VARCHAR(50) NOT NULL,
  "initialState" VARCHAR(255) NOT NULL,
  render JSONB NOT NULL,
  states JSONB NOT NULL
);

CREATE TABLE instances (
  "instanceID" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "workflowID" VARCHAR(255) REFERENCES workflows("workflowID"),
  "clientID" VARCHAR(255),
  "currentState" VARCHAR(255),
  "stateData" JSONB
);