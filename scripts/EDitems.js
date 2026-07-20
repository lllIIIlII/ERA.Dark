function newItem(name) {
	exports[name] = (() => {
		let myItem = extend(Item, name, {});
		return myItem;
	})();
}
newItem("铬")
newItem("锰")
newItem("铁")
newItem("钴")
newItem("镍")
newItem("钼")
newItem("铀")

newItem("金刚砂")
newItem("磨砂金属粉末")

newItem("钢")
newItem("镍铜合金")
newItem("锰钢")
newItem("钴钢")
newItem("殷瓦钢")
newItem("结构钢")

newItem("暗金属")
newItem("暗能钢")
newItem("空间节点")