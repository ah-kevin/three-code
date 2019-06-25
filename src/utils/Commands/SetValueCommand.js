import {Command} from "../Command";

export class SetValueCommand extends Command {
    /**
     *
     * @param object THREE.Object3D
     * @param attributeName string
     * @param newValue number, string, boolean or object
     */
    constructor(object, attributeName, newValue) {
        super();
        this.type = 'SetValueCommand';
        this.name = 'Set ' + attributeName;
        this.updatable = true;
        this.object = object;
        this.attributeName = attributeName;
        this.oldValue = (object !== undefined) ? object[attributeName] : undefined;
        this.newValue = newValue;
    }

    execute() {
        this.object[this.attributeName] = this.newValue;
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    update(cmd) {
        this.newValue = cmd.newValue;
    }
}
