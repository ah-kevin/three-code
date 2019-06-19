import {ViewPort} from "./ViewPort";
import UI from "./ui";

export class ViewPortInfo extends ViewPort {
    constructor(editor) {
        super(editor);
        this.setUI();
        this.signals.objectAdded.add(() => this.update());
        this.signals.objectRemoved.add(() => this.update());
        this.signals.geometryChanged.add(() => this.update());
    }

    setUI() {
        const container = new UI.Panel();
        container.setId('info');
        container.setPosition('absolute');
        container.setLeft('10px');
        container.setBottom('10px');
        container.setFontSize('12px');
        container.setColor('#fff');

        this.objectsText = new UI.Text('0').setMarginLeft('6px');
        this.verticesText = new UI.Text('0').setMarginLeft('6px');
        this.trianglesText = new UI.Text('0').setMarginLeft('6px');
        container.add(new UI.Text('物体'));
        container.add(this.objectsText, new UI.Break());
        container.add(new UI.Text('顶点'));
        container.add(this.verticesText, new UI.Break());
        container.add(new UI.Text('三角形'));
        container.add(this.trianglesText, new UI.Break());
        this.container.add(container);
    }

    update() {
        let objects = 0, vertices = 0, triangles = 0;
        for (let i = 0, l = this.scene.children.length; i < l; i++) {
            var object = this.scene.children[i];
            object.traverseVisible((object) => {

                objects++;

                if (object.isMesh) {

                    let geometry = object.geometry;

                    if (geometry.isGeometry) {

                        vertices += geometry.vertices.length;
                        triangles += geometry.faces.length;

                    } else if (geometry.isBufferGeometry) {

                        vertices += geometry.attributes.position.count;

                        if (geometry.index !== null) {

                            triangles += geometry.index.count / 3;

                        } else {

                            triangles += geometry.attributes.position.count / 3;

                        }

                    }

                }

            });
        }
        this.objectsText.setValue(objects);
        this.verticesText.setValue(vertices);
        this.trianglesText.setValue(triangles);
    }
}
