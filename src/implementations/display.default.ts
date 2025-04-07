import { DisplayData, IDisplay } from "../interfaces/displayinterface";
import { Instance, Workflow } from "../interfaces/workflowinterface";

export class DefaultDisplay implements IDisplay {

    async processDisplay(
        clientID: string, 
        curentWorkflow: Workflow, 
        instance: Instance, 
        currentState: string): Promise<DisplayData> {
        
        console.log("*** processDisplay");
        console.log("instance=", instance);
        console.log("states=", curentWorkflow.states);
        // build the display data to return
        let displayData: DisplayData = {displayData: []};
        // for each display entry check condition and process if required
        const display = curentWorkflow.states.find(item => { return item.state_id == currentState});
        console.log("display=", display);
        const displayTemplate = display.display_data;
        console.log("displayTemplate=", displayTemplate);
        for(var i=0; i<displayTemplate.length; i++) {
            // condition can use instance.stateData
            if(eval(displayTemplate[i])) {
                switch(displayTemplate[i].type) {
                    case "text":
                        displayTemplate[i].text= this.parseString(displayTemplate[i].text, instance.state_data);
                        break;
                    case "stateData":
                        displayTemplate[i].metadata= this.parseString(displayTemplate[i].metadata, instance.state_data);
                        break;
                    case "control":
                        displayTemplate[i].text= this.parseString(displayTemplate[i].text, instance.state_data);
                        break;
                }
                displayData.displayData[i]=displayTemplate[i];
            }
        }

        return displayData;
    }

    parseString(text: string, data: any) {
        // Split out the string
        const parts = text.split(/[{,}]/);
        // check every other string segment looking for a key in data
        // Text for parsing should not start with a variable "{variable} hello!"
        // *** repalce this code with a more comprehensive parser
        for(var i=1;i<parts.length; i+=2) {
            // find this value in the data
            let value = data.find(parts[i]);
            if(value) {
                // if there is a value, replace the entry
                parts[i]=value;
            }
        }
        // put the string back together again
        return parts.join();
    }
}