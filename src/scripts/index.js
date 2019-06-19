import '../styles/index.scss';

import {Editor} from "../utils/Editor";
import {ViewPort} from "../utils/ViewPort";
import {WebGLRenderer} from "three";
import {AddObjectCommand} from "../utils/Commands/AddObjectCommand";
import UI from "../utils/ui";
import {ToolBar} from "../utils/ToolBar";

const editor = new Editor();
const viewport = new ViewPort(editor);
document.body.appendChild(viewport.container.dom);
const toolBar = new ToolBar(editor);
document.body.appendChild(toolBar.container.dom);
const render = new WebGLRenderer();
//
editor.signals.rendererChanged.dispatch(render);

console.log(editor);
