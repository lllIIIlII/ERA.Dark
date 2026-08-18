function newLiquid(name) {
	exports[name] = (() => {
		let myLiquid = extend(Liquid, name, {});
		return myLiquid;
	})();
}
newLiquid("润滑剂")
newLiquid("STAL-加速流体")
newLiquid("盐酸")
newLiquid("富液")

newLiquid("水蒸气")
newLiquid("氯")
newLiquid("氩")