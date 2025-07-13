import {BlockType} from "./blockType.ts";
import {Point} from "../drawer/point.ts";

export interface Map {
    name: string;
    description: string | null;
    spawns: Point[];
    blocks: BlockType[][];
}