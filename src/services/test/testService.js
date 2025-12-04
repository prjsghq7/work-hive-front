import {call} from "../common/common.js";

export function test(){
    return call("/test/requestTest", "GET", null);
}