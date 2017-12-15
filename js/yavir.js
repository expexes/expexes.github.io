const XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
const xhttp = new XHR();

const $ = this;

const $route = {};
let $data = {};

function x(p) {
	return new X(p)
}

function X(p) {
	$.el = p
}

function fix(callback) {
	if (typeof($.el) !== "object") {
		document.querySelectorAll($.el).forEach(function (e) {
			callback(e)
		});
	} else {
		callback($.el)
	}
	return x($.el)
}

X.prototype.fix = function (callback) {
	fix(callback)
};

X.prototype.on = function (type, callback) {
	fix(e => e.addEventListener(type, callback))
};

X.prototype.html = function (html) {
	let tmp = '';
	if (typeof(html) !== "undefined")
		fix(e => e.innerHTML = html);
	else
		fix(e => tmp = e.innerHTML);
	return tmp
};

X.prototype.val = function () {
	fix(e => this.val = e.value);
	return this.val
};

X.prototype.addClass = function (cls) {
	return fix(e => e.classList.add(cls));
};

X.prototype.removeClass = function (cls) {
	return fix(e => e.classList.remove(cls))
};

X.prototype.hasClass = function (cls) {
	let hasClass = false;
	fix(e => hasClass = e.classList.contains(cls));
	return hasClass
};

X.prototype.style = function (style) {
	return fix(e => e.style(style))
};

X.prototype.createElement = function (element) {
	return fix(e => e.createElement(element));
};

X.prototype.appendChild = function (child) {
	return fix(e => e.appendChild(child));
};

function setCookie(name, value, options) {
	options = options || {};

	let expires = options.expires;

	if (typeof expires === "number" && expires) {
		let d = new Date();
		d.setTime(d.getTime() + expires * 1000);
		expires = options.expires = d;
	}

	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString();
	}

	value = encodeURIComponent(value);

	let updatedCookie = name + "=" + value;

	for (let propName in options) {
		updatedCookie += "; " + propName;
		let propValue = options[propName];
		if (propValue !== true) {
			updatedCookie += "=" + propValue;
		}
	}

	document.cookie = updatedCookie;
}

function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function request(params) {

	if ("undefined" !== typeof params.headers) {
		if (params.headers.length !== 0) {
			params.headers.forEach(function (e) {
				xhttp.setRequestHeader(e.a, e.b)
			});
		}
	}

	if ("undefined" === typeof params.async) params.async = true;

	xhttp.open(params.method, params.url, params.async);
	xhttp.send();

	if ("undefined" !== typeof params.onStart) {
		xhttp.onloadstart = function () {
			params.onStart(xhttp)
		}
	}

	if ("undefined" !== typeof params.onProgress) {
		xhttp.onprogress = function (event) {
			params.onProgress(event)
		}
	}

	if ("undefined" !== typeof params.onAbort) {
		xhttp.onabort = function () {
			params.onAbort(xhttp)
		}
	}

	if ("undefined" !== typeof params.onError) {
		xhttp.onerror = function () {
			params.onError(xhttp)
		}
	}

	if ("undefined" !== typeof params.onSuccess) {
		xhttp.onload = function () {
			params.onSuccess(xhttp)
		}
	}

	if ("undefined" !== typeof params.onTimeout) {
		xhttp.ontimeout = function () {
			params.onTimeout(xhttp)
		}
	}

	if ("undefined" !== typeof params.onComplete) {
		xhttp.onloadend = function () {
			params.onComplete(xhttp)
		}
	}
}

function Yavir(prms) {
	$.Yavor = prms;
}


Yavir.prototype.run = function () {

	if ($.Yavor.mode === 'hash' && window.location.hash === "") {
		history.replaceState({}, '', '#/');
	}

	render();
	renderActive();

	x(window).on($.Yavor.mode === 'hash' ? 'hashchange' : 'popstate', function () {
		renderActive()
	});

	function render() {
		for (const e of $.Yavor.components) {
			if (e.route === undefined) {
				x(e.selector).html(e.template);
				if (e.script !== undefined)
					e.script()
			}
		}
	}

	function matchPath(p, r) {
		let names = p.match(new RegExp(':([a-zA-Z]+)', 'g'));

		p = p.replace(new RegExp(':([a-zA-Z]+)', 'g'), '([a-zA-Z0-9]+)');
		let params = r.match(new RegExp('^' + p + '$'));

		$route['path'] = r;

		if (params !== null && names !== null)
			for (let i = 1; i <= names.length; i++)
				$route[names[i - 1].replace(':', '')] = params[i];

		return params !== null;
	}

	function renderActive() {
		const found = $.Yavor.components.find(function (e) {
			if ($.Yavor.mode === 'hash' && ("undefined" !== typeof e.route)) {
				return matchPath(e.route, window.location.hash.substr(1, window.location.hash.length));
			} else {
				return matchPath(e.route, window.location.pathname);
			}
		});

		if (found) {
			x($.Yavor.el).html('<' + found.selector + '>' + '</' + found.selector + '>');
			renderComponent(found);

			x('title[load]').fix(x => {
				window.document.title = x.innerHTML
			});
		} else {
			x('view').html(page('pages/404.html'))
		}
	}

	function renderComponent(component) {
		let tpl = ("function" === typeof component.template) ? component.template() : component.template;

		let con = /\{{(.*?)}}/g;
		let start = tpl.indexOf('<script load>');
		let end = tpl.substr(start, tpl.length).indexOf('</script>');

		if (start > 0 && end > 0) {
			$.eval(tpl.substr(start + 13, end - 13));
		}

		tpl = tpl.replace(con, (q, val) => {
			val = val.trim();
			val = $data[val];
			return ("function" === typeof val) ? val() : val
		});

		x(component.selector).html(tpl);

		x('script[load]').fix(x => {
			$.eval(x.innerHTML)
		});

		if (component.components !== null && "undefined" !== typeof component.components) {
			component.components.forEach(function (c, i, a) {
				renderComponent(c);
			});
		}
	}
};

function url(href) {
	if ($.Yavor.mode === 'hash') {
		window.location.hash = href
	} else {
		history.pushState({}, '', href);
		window.dispatchEvent(new Event('popstate'));
	}
}

function log(text) {
	console.log(text)
}

function page(file, async = false) {
	let rawFile = new XMLHttpRequest();
	let s;
	rawFile.open("GET", file, async);
	rawFile.onreadystatechange = function () {
		if (rawFile.readyState === 4) {
			if (rawFile.status === 200 || rawFile.status === 0) {
				s = rawFile.responseText;
			}
		}
	};
	rawFile.send(null);
	return s;
}
