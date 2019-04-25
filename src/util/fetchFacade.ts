import {fetch as fetchPolyfill} from "whatwg-fetch";

export default window.fetch.bind(window) || fetchPolyfill;
