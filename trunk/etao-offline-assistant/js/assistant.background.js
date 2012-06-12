var selectedIndex = null;		// 选中的标签
var selected = {};					// 选中的商品
var selected_epid = null;		// 选中的产品

// 监听从contentScript传来的添加商品和获取配置的事件
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.nid) {
			selected[request.nid] = request.status ? request : null;
			sendResponse({status: true, code: request.status ? 'Item moved into trashbox' : 'Item moved out of trashbox' });
		} else if (request.options) {
			sendResponse(assistant.getOptions());
		} else if (request.text) {
			var textarea = document.getElementById("clipboard");
			textarea.value = request.text;
			textarea.select();
			document.execCommand("copy", false, null);
			sendResponse({});
	  } else {
			sendResponse({});
		}
	}
);

var MenuHandlers = {
	offline: function(info, tab) {
		chrome.tabs.getSelected(null, function (tab) {
			selectedIndex = tab.id;
			chrome.tabs.create({ url: 'offline.html', selected: true, index: tab.index+1 });
		});
	},
	category_revise: function(info, tab) {
		chrome.tabs.getSelected(null, function (tab) {
			selectedIndex = tab.id;
			chrome.tabs.create({ url: 'category_revise.html', selected: true, index: tab.index+1 });
		});
	},
	epid_add: function(info, tab) {
		chrome.tabs.getSelected(null, function (tab) {
			selectedIndex = tab.id;
			chrome.tabs.create({ url: 'epid_add.html', selected: true, index: tab.index+1 });
		});
	},
	epid_remove: function(info, tab) {
		chrome.tabs.getSelected(null, function (tab) {
			selectedIndex = tab.id;
			chrome.tabs.create({ url: 'epid_remove.html', selected: true, index: tab.index+1 });
		});
	}
};

// 菜单项只在某些页面才出现
function getDocumentUrlPatterns(action) {
	return [
		"http://s.etao.com/search?*",
		"http://s.etao.com/item*",
		"http://*.s.etao.com/search?*",
		"http://*.s.etao.com/item*",
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
	"onclick" : MenuHandlers.offline,
	"documentUrlPatterns" : getDocumentUrlPatterns('offline')
});

// 注册类目订正菜单
chrome.contextMenus.create({
	"title" : chrome.i18n.getMessage("menu_category_revise"),
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : MenuHandlers.category_revise,
	"documentUrlPatterns" : getDocumentUrlPatterns('category_revise')
});

// 分隔符
chrome.contextMenus.create({"type" : "separator", "contexts" : ["all"]});

// 打上EPID菜单
chrome.contextMenus.create({
	"title" : chrome.i18n.getMessage("menu_epid_add"),
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : MenuHandlers.epid_add,
	"documentUrlPatterns" : ["http://s.etao.com/search?*"]
});

// 移除EPID菜单
chrome.contextMenus.create({
	"title" : chrome.i18n.getMessage("menu_epid_remove"),
	"type" : "normal",
	"contexts" : ["all"],
	"onclick" : MenuHandlers.epid_remove,
	"documentUrlPatterns" : ["http://s.etao.com/item*"]
});
