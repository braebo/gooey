//- Hypothetical component api
// @ts-nocheck
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { styled } from '../../decorators/styled';
let TerminalSvg = class TerminalSvg {
    class = 'fracgui-terminal-icon';
    tagname = 'div';
    onclick = (e) => {
        e.stopPropagation();
        console.log(this);
    };
    constructor(opts) {
        super(opts);
    }
    static style = /*css*/ `
        .fracgui-terminal-icon {
            position: absolute;
            right: -1.5rem;
            top: 0;
            bottom: 0;
            width: 16px;
            height: 16px;
            transform: translateY(15%);
            opacity: 0;
        }

        .fracgui-terminal-icon:hover {
            opacity: 1;
        }

        .fracgui-terminal-icon svg {
            width: 100%;
            height: 100%;
        }

        .fracgui-terminal-icon svg .icon {
            stroke: var(--fracgui-fg-c);
        }

        .fracgui-terminal-icon svg .icon:hover {
            stroke: var(--fracgui-theme-a);
        }
    `;
};
TerminalSvg = __decorate([
    component,
    __metadata("design:paramtypes", [Object])
], TerminalSvg);
export { TerminalSvg };
