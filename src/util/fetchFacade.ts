import {fetch as fetchPolyfill} from "whatwg-fetch";

export default window.fetch || fetchPolyfill;
