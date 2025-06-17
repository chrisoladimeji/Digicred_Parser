import { IActionExtension } from "../src/interfaces/actionextension";
import { Transition } from "../src/interfaces/actioninterface";
import { Instance, Workflow } from "../src/interfaces/workflowinterface";

export class ExtendedAction implements IActionExtension {
    async actions(actionInput: any, instance: Instance, action: any, transition: Transition): Promise<[Transition, Instance]>{
        console.log("^^^ Extension -> actions");
        // handle the types of actions
        switch(action?.type) {
            case "extension":
                // check condition
                if(eval(action.condition)) {
                    // save the data from the workflow action to the instance data
                    instance.state_data = Object.assign(instance.state_data, action.value);
                }
                break;
            default:
        }
    
        return [transition, instance];
    };
}