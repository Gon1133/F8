import { createStore } from "./core.js";
import reducer from "./reducer.js";
import withLogger from './logger.js'


const { attach, connect, dispatch } = createStore(withLogger(reducer))
// createStore cần 1 hàm trả về giá trị khởi tạo cho state 


window.dispatch = dispatch

export {
    attach,
    connect
}