import { Transition } from "../src/interfaces/actioninterface";
import { IDisplayExtension } from "../src/interfaces/displayextension";
import { Instance, Workflow } from "../src/interfaces/workflowinterface";

export class ExtendedDisplay implements IDisplayExtension {
    async displays(instance: Instance, template: any): Promise<any>{
        console.log("^^^ Extension -> displays");
        // handle the types of actions
        switch(template.type) {
            case "extended":
                template.text= "Extended display render!!";
                break;
        }    
        return template;
    };
}