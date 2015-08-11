///<reference path='../../typings/i18next/i18next.d.ts' />

/**
 * 国際化対応のためのモジュール。デフォルトでは日本語。
 */

"use strict";

import {isNodeJS} from "../utils/utils";

import {en} from "./en";
import {ja} from "./ja";

/* tslint:disable:no-use-before-declare */

let i18next: I18nextStatic;
let data: { [lang: string]: any; } = {
	"ja": ja,
	"en": en
};

export function setup(lang = "ja") {
	"use strict";

	if (typeof (<any>i18next).backend !== "undefined") {
		(<any>i18next).backend({
			fetchOne: (lng: any, ns: any, func: Function) => {
				func(null, data[lng] || data[lang]);
			}
		});
		i18next.init({ lng: lang });
	} else {
		let opts = {
			lng: lang,
			customLoad: function(lng: any, ns: any, options: any, loadComplete: Function) {
				loadComplete(null, data[lng] || data["ja-JP"]);
			}
		};
		i18next.init(opts);
	}
}

export function t(str: string, ...args: any[]): string {
	"use strict";

	return i18next.t(str, { postProcess: "sprintf", sprintf: args });
}

if (isNodeJS()) {
	i18next = require("i18next");
} else {
	i18next = (<any>window).i18n;
}

/* tslint:enable:no-use-before-declare */

setup();
