define(["backbone", "constants"], function() {
	return function(c) {
		this.userId = c;
		this.setUserValue = function(a, b) {
			localStorage.setItem(a + "_" + c, JSON.stringify(b))
		};
		this.getUserValue = function(a, b) {
			var d = localStorage.getItem(a + "_" + c);
			return d && "undefined" != d ? JSON.parse(d) : b
		};
		this.setView = function(a) {
			this.setUserValue(CONFIG_VIEW_BY, a)
		};
		this.getView = function() {
			return this.getUserValue(CONFIG_VIEW_BY, DEFAULT_VIEW_BY)
		};
		this.setCollapsedCategories = function(a) {
			this.setUserValue(CONFIG_COLLAPSED_CATEGORIES, a)
		};
		this.getCollapsedCategories = function() {
			this.getUserValue(CONFIG_COLLAPSED_CATEGORIES, [])
		};
		this.setCalendarDay = function(a) {
			this.setUserValue(CONFIG_CALENDAR_DAY, a)
		};
		this.getCalendarDay = function() {
			var a = navigator.language.split("-")[1],
				b = 2;
			try {
				var d = "AS,AZ,BW,CA,CN,FO,GE,GL,GU,HK,IE,IL,IN,IS,JM,JP,KG,KR,LA,MH,MN,MO,MP,MT,NZ,PH,PK,SG,SY,TH,TT,TW,UM,US,UZ,VI,ZW,ET,MW,NG,TJ,GB".split(","); - 1 < "AF,BH,DJ,DZ,EG,ER,ET,IQ,IR,JO,KE,KW,LY,MA,OM,QA,SA,SD,SO,TN,YE".split(",").indexOf(a) ? b = 7 : -1 < d.indexOf(a) && (b = 1)
			} catch (c) {
				console.error(c)
			}
			return this.getUserValue(CONFIG_CALENDAR_DAY, b)
		}
	}
});