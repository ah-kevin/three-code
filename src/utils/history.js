import {Command} from "./Command";

export default class History {
    constructor(editor) {
        this.editor = editor;
        this.undos = [];
        this.redos = [];
        this.lastCmdTime = new Date();
        this.idCounter = 0;

        this.historyDisabled = false;
        new Command(editor);
    }

    execute(cmd, optionalName) {
        cmd.name = (optionalName !== undefined) ? optionalName : cmd.name;
        cmd.execute();
    }

    clear() {

        this.undos = [];
        this.redos = [];
        this.idCounter = 0;
        // this.editor.signals.historyChanged.dispatch();
    }
}
