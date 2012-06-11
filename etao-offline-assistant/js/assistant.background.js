var selectedIndex = null;
var selected = {};

// 监听从contentScript传来的添加商品和获取配置的事件
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.nid) {
			selected[request.nid] = request.status ? request : null;
			sendResponse({status: true, code: request.status ? 'Item moved into trashbox' : 'Item moved out of trashbox' });
		} else if (request.options) {
			sendResponse(assistant.getOptions());
		} else {
			sendResponse({});
		}
	}
);

// 打开宝贝下架页面
function getOfflineHandler() {
	return function(info, tab) {
		chrome.tabs.getSelected(null, function (tab) {
			selectedIndex = tab.id;
			chrome.tabs.create({ url: 'offline.html', selected: true, index: tab.index+1 });
		});
	};
};

// 打开宝贝类目订正页面
function getReviseHandler() {
	return function(info, tab) {
		chrome.tabs.getSelected(null, function (tab) {
			selectedIndex = tab.id;
			chrome.tabs.create({ url: 'revise.html', selected: true, index: tab.index+1 });
		});
	};
};

function getDocumentUrlPatterns() {
	return [
		"http://s.etao.com/search?*",
		"http://www.etao.com/search?*"
	];
}

// 处理完毕后重置复选框
function resetCheckBoxes() {
	chrome.tabs.executeScript(selectedIndex, {code: "jQuery('input.injected').attr('checked', false);"});
	selected = {};
	selectedIndex = null;
}

// 注册下架菜单
chrome.contextMenus.create({
	"title" : chrome.i18n.getMessage("menu_offline"),
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : getOfflineHandler(),
	"documentUrlPatterns" : getDocumentUrlPatterns()
});

// 注册类目订正菜单
chrome.contextMenus.create({
	"title" : chrome.i18n.getMessage("menu_revise"),
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : getReviseHandler(),
	"documentUrlPatterns" : getDocumentUrlPatterns()
});