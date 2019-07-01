/**
 * @param object THREE.Object3D
 * @constructor
 */
import {Command} from "../Command";

export class SetHelperCommand extends Command {
    constructor(object) {
        super();
        this.type = 'SetHelperCommand';
        this.object = object;
        if (object !== undefined) {
            this.name = 'Set Object: ' + object.name;
        }
    }

    execute() {
        this.editor.setHelper(this.object);
    }

    undo() {

    }
}
