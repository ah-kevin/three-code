import UI from "./ui";
import * as THREE from 'three';
import {AddObjectCommand} from "./Commands/AddObjectCommand";

export class ToolBar {
    constructor(editor) {
        this.signals = editor.signals;
        this.container = new UI.Panel();
        this.container.setId('toolbar');
        this.addButton(editor);
    }

    addButton(editor) {
        let buttons = new UI.Panel();
        this.container.add(buttons);

        let addBox = new UI.Button('圆柱体');
        addBox.dom.className = 'Button';
        addBox.onClick(_ => {
            const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
            const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial());
            mesh.name = 'Box';
            editor.execute(new AddObjectCommand(mesh));
        });
        buttons.add(addBox);
    }
}
