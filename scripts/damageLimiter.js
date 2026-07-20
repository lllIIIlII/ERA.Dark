const cs = extend(UnitType, "测试", {
update(unit){}
});
cs.constructor = () => extend(UnitEntity, {
damage(amount){
if (amount >= 60){
return this.health -= 60
}
this.super$damage(1)
},
classId: () => cs.classId

})

refresh(cs)