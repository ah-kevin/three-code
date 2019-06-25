import {Command} from "../Command";

/**
 * @param object THREE.Object3D
 * @param newPosition THREE.Vector3
 * @param optionalOldPosition THREE.Vector3
 * @constructor
 */
export class SetPositionCommand extends Command {
    constructor(object, newPosition, optionalOldPosition) {
        super();
        this.type = 'SetPositionCommand';
        this.name = 'Set Position';
        this.updatable = true;
        this.object = object;
        if (object !== undefined && newPosition !== undefined) {
            this.oldPosition = object.position.clone();
            this.newPosition = newPosition.clone();
        }
        if (optionalOldPosition !== undefined) {
            this.oldPosition = optionalOldPosition.clone();
        }
    }

    execute() {
        this.object.position.copy(this.newPosition);
        this.object.updateMatrixWorld(true);
        this.editor.signals.objectChanged.dispatch(this.object);
    }

    update(cmd) {
        this.newPosition.copy( cmd.newPosition );
    }
}
