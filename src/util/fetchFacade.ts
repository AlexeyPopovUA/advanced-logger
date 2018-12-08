import {fetch as fetchPolyfill} from "whatwg-fetch";

module.exports = window.fetch || fetchPolyfill;
