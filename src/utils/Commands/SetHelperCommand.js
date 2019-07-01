/**
 * @param object THREE.Object3D
 * @constructor
 */
import {Command} from "../Command";

export class AddHelperCommand extends Command {
    constructor(object) {
        super();
        this.type = 'AddHelperCommand';
        this.object = object;
        if (object !== undefined) {
            this.name = 'Add Object: ' + object.name;
        }
    }

    execute() {
        this.editor.addObject(this.object);
        this.editor.select(this.object);
    }

    undo() {
        this.editor.removeObject(this.object);
        this.editor.deselect();
    }
}
