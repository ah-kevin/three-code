import {Command} from "../Command";

/**
 * @param object THREE.Object3D
 * @param newPosition THREE.Vector3
 * @param optionalOldPosition THREE.Vector3
 * @constructor
 */
export class SetRotationCommand extends Command {
    constructor(object, newRotation, optionalOldRotation) {
        super();

        this.type = 'SetRotationCommand';
        this.name = 'Set Rotation';
        this.updatable = true;

        this.object = object;

        if (object !== undefined && newRotation !== undefined) {

            this.oldRotation = object.rotation.clone();
            this.newRotation = newRotation.clone();

        }

        if (optionalOldRotation !== undefined) {

            this.oldRotation = optionalOldRotation.clone();

        }

    }

    execute() {
        this.object.rotation.copy( this.newRotation );
        this.object.updateMatrixWorld( true );
        this.editor.signals.objectChanged.dispatch( this.object );
    }

    update(cmd) {
        this.newRotation.copy( cmd.newRotation );
    }
}
