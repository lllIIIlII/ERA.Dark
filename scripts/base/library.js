//感谢泰拉世纪工厂提供的代码

function MultiCrafterBuild() {
    this.acceptItem = function(source, item) {
        if(this._toggle < 0) return false;
        if(typeof this.block["getInputItemSet"] !== "function") return false;
        if(this.items.get(item) >= this.getMaximumAccepted(item)) return false;
        if(this._toggle >= 0) {
            const recipe = this.block.getRecipes()[this._toggle];
            return recipe.input.items.some(stack => stack.item === item);
        }
        return false;
    };
    this.acceptLiquid = function(source, liquid) {
        if(this._toggle < 0) return false;
        if(typeof this.block["getInputLiquidSet"] !== "function") return false;
        if(this._toggle >= 0) {
            const recipe = this.block.getRecipes()[this._toggle];
            return recipe.input.liquids.some(stack => stack.liquid === liquid);
        }
        return false;
    };
    this.removeStack = function(item, amount) {
        var ret = this.super$removeStack(item, amount);
        if(!this.items.has(item)) this.toOutputItemSet.remove(item);
        return ret;
    };
    this.handleItem = function(source, item) {
        var current = this._toggle;
        if(current > -1 && this.block.getRecipes()[current].output.items.some(a => a.item == item)) {
            this.toOutputItemSet.add(item);
        }
        this.items.add(item, 1);
    };
    this.handleStack = function(item, amount, tile, source) {
        var current = this._toggle;
        if(current > -1 && this.block.getRecipes()[current].output.items.some(a => a.item == item)) {
            this.toOutputItemSet.add(item);
        }
        this.items.add(item, amount);
    };
    this.displayConsumption = function(table) {
        if(typeof this.block["getRecipes"] !== "function") return;
        const recs = this.block.getRecipes();
        if (this.config() !== null){var current = this.config()}else{var current = -1};
        if (current >= 0){
            var items = recs[current].input.items;
            var _items = recs[current].output.items;
            var liquids = recs[current].input.liquids;
            var _liquids = recs[current].output.liquids;
            table.left();
            for(var j = 0, len = items.length; j < len; j++) {
                (function(that, stack) {
                    table.add(new ReqImage(new StatValues.stack(stack.item, stack.amount), () => that.items != null && that.items.has(stack.item, stack.amount))).size(8 * 4);
                })(this, items[j]);
            };
            for(var k = 0, len = liquids.length; k < len; k++) {
                (function(that, stack) {
                    table.add(new ReqImage(new StatValues.stack(stack.liquid, stack.amount), () => that.liquids != null && that.liquids.get(stack.liquid) > stack.amount)).size(8 * 4);
                })(this, liquids[k]);
            };
            table.add(" => ");
            for(var l = 0, len = _items.length; l < len; l++) {
                (function(that, stack) {
                    table.add(new ReqImage(new StatValues.stack(stack.item, stack.amount), () => that.items != null && that.items.has(stack.item, stack.amount))).size(8 * 4);
                })(this, _items[l]);
            };
            for(var m = 0, len = _liquids.length; m < len; m++) {
                (function(that, stack) {
                    table.add(new ReqImage(new StatValues.stack(stack.liquid, stack.amount), () => that.liquids != null && that.liquids.get(stack.liquid) > stack.amount)).size(8 * 4);
                })(this, _liquids[m]);
            };
        }else{
            table.left();
            table.add("  未选择配方")
        }
    };
    this.getPowerProduction = function() {
        var i = this._toggle;
        if(i < 0 || typeof this.block["getRecipes"] !== "function") return 0;
        var oPower = this.block.getRecipes()[i].output.power;
        if(oPower > 0 && this._cond) {
            if(this.block.getRecipes()[i].input.power > 0) {
                this._powerStat = this.efficiency();
                return oPower * this.efficiency();
            } else {
                this._powerStat = 1;
                return oPower;
            };
        }
        this._powerStat = 0;
        return 0;
    };
    this.getProgressIncreaseA = function(i, baseTime) {
        if(typeof this.block["getRecipes"] !== "function" || this.block.getRecipes()[i].input.power > 0) return this.getProgressIncrease(baseTime);
        else return 1 / baseTime * this.delta();
    };
    this.checkinput = function(i) {
        const recs = this.block.getRecipes();
        var items = recs[i].input.items;
        var liquids = recs[i].input.liquids;
        if(!this.items.has(items)) return true;
        for(var j = 0, len = liquids.length; j < len; j++) {
            if(this.liquids.get(liquids[j].liquid) < liquids[j].amount) return true;
        };
        return false;
    };
    this.checkoutput = function(i) {
        const recs = this.block.getRecipes();
        var items = recs[i].output.items;
        var liquids = recs[i].output.liquids;
        for(var j = 0, len = items.length; j < len; j++) {
            if(this.items.get(items[j].item) + items[j].amount > this.getMaximumAccepted(items[j].item)) return true;
        };
        for(var j = 0, len = liquids.length; j < len; j++) {
            if(this.liquids.get(liquids[j].liquid) + liquids[j].amount > this.block.liquidCapacity) return true;
        };
        return false;
    };
    this.checkCond = function(i) {
        if(this.block.getRecipes()[i].input.power > 0 && this.power.status <= 0) {
            this._condValid = false;
            this._cond = false;
            return false;
        } else if(this.checkinput(i)) {
            this._condValid = false;
            this._cond = false;
            return false;
        } else if(this.checkoutput(i)) {
            this._condValid = true;
            this._cond = false;
            return false;
        };
        this._condValid = true;
        this._cond = true;
        return true;
    };
    this.customCons = function(i) {
        const recs = this.block.getRecipes();
        if(this.checkCond(i)) {
            if(this.progressArr[i] != 0 && this.progressArr[i] != null) {
                this.progress = this.progressArr[i];
                this.progressArr[i] = 0;
            };
            this.progress += this.getProgressIncreaseA(i, recs[i].craftTime);
            this.totalProgress += this.delta();
            this.warmup = Mathf.lerpDelta(this.warmup, 1, 0.02);
            if(Mathf.chance(Time.delta * this.updateEffectChance)) Effects.effect(this.updateEffect, this.x + Mathf.range(this.size * 4), this.y + Mathf.range(this.size * 4));
        } else this.warmup = Mathf.lerp(this.warmup, 0, 0.02);
    };
    this.customProd = function(i) {
        const recs = this.block.getRecipes();
        var inputItems = recs[i].input.items;
        var inputLiquids = recs[i].input.liquids;
        var outputItems = recs[i].output.items;
        var outputLiquids = recs[i].output.liquids;
        var eItems = this.items;
        var eLiquids = this.liquids;
        for(var k = 0, len = inputItems.length; k < len; k++) eItems.remove(inputItems[k]);
        for(var j = 0, len = inputLiquids.length; j < len; j++) eLiquids.remove(inputLiquids[j].liquid, inputLiquids[j].amount);
        for(var a = 0, len = outputItems.length; a < len; a++) {
            for(var aa = 0, amount = outputItems[a].amount; aa < amount; aa++) {
                var oItem = outputItems[a].item
                if(!this.put(oItem)) {
                    if(!eItems.has(oItem)) this.toOutputItemSet.add(oItem);
                    eItems.add(oItem, 1);
                };
            };
        };
        for(var j = 0, len = outputLiquids.length; j < len; j++) {
            var oLiquid = outputLiquids[j].liquid;
            if(eLiquids.get(oLiquid) <= 0.001) this.toOutputLiquidset.add(oLiquid);
            this.handleLiquid(this, oLiquid, outputLiquids[j].amount);
        };
        this.block.craftEffect.at(this.x, this.y);
        this.progress = 0;
    };
    this.updateTile = function() {
        if(typeof this.block["getRecipes"] !== "function") return;
        if(this.timer.get(1, 60)) {
            this.itemHas = 0;
            this.items.each(item => this.itemHas++);
        };
        if(!Vars.headless) this.block.invFrag.hide();
        const recs = this.block.getRecipes();
        var recLen = recs.length;
        var current = this._toggle;
        if(typeof this["customUpdate"] === "function") this.customUpdate();
        if(current >= 0) {
            this.customCons(current);
            if(this.progress >= 1) this.customProd(current);
        };
        var eItems = this.items;
        var eLiquids = this.liquids;
        if(this.block.doDumpToggle() && current == -1) return;
        var validOutputs = current > -1 ? 
        this.block.getRecipes()[current].output.items.map(i => i.item) : 
        [];
        var queItemSeq = this.toOutputItemSet.orderedItems();
        var queItem = [];
        for (var idx = 0; idx < queItemSeq.size; idx++) {
        var item = queItemSeq.get(idx);
            if (validOutputs.includes(item)) {
                queItem.push(item);
            }
        }
        var que = this.toOutputItemSet.orderedItems(),
            len = que.size,
            itemEntry = this.dumpItemEntry;
        if(this.timer.get(this.block.dumpTime) && len > 0) {
            for(var i = 0; i < len; i++) {
                var candidate = que.get((i + itemEntry) % len);
                if(this.put(candidate)) {
                    eItems.remove(candidate, 1);
                    if(!eItems.has(candidate)) this.toOutputItemSet.remove(candidate);
                    break;
                };
            };
            if(i != len) this.dumpItemEntry = (i + itemEntry) % len;
        };
        if (current >= 0) {
            for(var l = 0 ; l < recs[current].output.liquids.length ; l++){
                var ll = l + this._Direction;
                if(ll >= 4){
                    this.dumpLiquid(recs[current].output.liquids[l].liquid, 10.0, ll - 4);
                }else{
                    this.dumpLiquid(recs[current].output.liquids[l].liquid, 10.0, ll);
                }
            }
        }
    };
    this.shouldConsume = function() {
        return this._condValid && this.productionValid();
    };
    this.productionValid = function() {
        return this._cond && this.enabled;
    };

this.buildConfiguration = function(table) {
    table.setBackground(Styles.grayPanel);

    table.table(cons(buttonTable => {
        buttonTable.add("[accent]流体输出法线:").left().padRight(5);
        var switchButton = buttonTable.button(Tex.pane, Styles.clearTogglei, 40, () => {
            Sounds.click.play();
            this._Direction += 1;
            if(this._Direction >= 4) this._Direction = 0;
        }).get();
        switchButton.update(() => {
            switchButton.clearChildren();
            var d = ["右","上","左","下"];
            switchButton.add(d[this._Direction]).color(Color.white);
        });
    })).left().row();

    if(typeof this.block["getRecipes"] !== "function") return;
    const recs = this.block.getRecipes();
    const invFrag = this.block.getInvFrag();

    if(!invFrag.isBuilt()) invFrag.build(table.parent);
    if(invFrag.isShown()) {
        invFrag.hide();
        Vars.control.input.frag.config.hideConfig();
        return;
    }

    var group = new ButtonGroup();
    group.setMinCheckCount(0);
    group.setMaxCheckCount(1);

    table.defaults().left().fillX().pad(1);
    
    for(var i = 0; i < recs.length; i++) {
        table.table(cons(recipeRow => {
            recipeRow.left();

            (function(i, that) {
                var output = recs[i].output;
                var button = recipeRow.button(Tex.pane, Styles.clearTogglei, () => {
                    Sounds.click.play();
                    that.configure(i);
                }).group(group).size(40).get();

                button.getStyle().up = Styles.black3;
                button.getStyle().down = Styles.flatOver;
                button.getStyle().checked = Styles.accentDrawable;

                let icon = Icon.cancel;
                if(output != null) {
                    if(output.items && output.items.length > 0)
                        icon = output.items[0].item.uiIcon;
                    else if(output.liquids && output.liquids.length > 0)
                        icon = output.liquids[0].liquid.uiIcon;
                    else if(output.power > 0)
                        icon = Icon.power;
                }

                button.getStyle().imageUp = new TextureRegionDrawable(icon);
                button.update(() => button.setChecked(i === that._toggle));
            })(i, this);

            recipeRow.table(cons(inputTable => {
                inputTable.left();
                var rec = recs[i];
                
                for(var j = 0; j < rec.input.items.length; j++) {
                    var stack = rec.input.items[j];
                    inputTable.image(stack.item.uiIcon).size(24).padRight(2);
                    inputTable.add(stack.amount.toString()).color(Color.lightGray).size(16);
                }
                
                for(var j = 0; j < rec.input.liquids.length; j++) {
                    var stack = rec.input.liquids[j];
                    inputTable.image(stack.liquid.uiIcon).size(24).padRight(2);
                    inputTable.add(stack.amount.toFixed(1)).color(Color.lightGray).size(16);
                }
                
                if(rec.input.power > 0) {
                    inputTable.image(Icon.power).size(24).padRight(2);
                    inputTable.add((rec.input.power * 60).toFixed(0)).color(Color.lightGray).size(16);
                }
                
                inputTable.add(" => ").color(Color.gray);
                
                for(var j = 0; j < rec.output.items.length; j++) {
                    var stack = rec.output.items[j];
                    inputTable.image(stack.item.uiIcon).size(24).padRight(2);
                    inputTable.add(stack.amount.toString()).color(Color.yellow).size(16);
                }
                
                for(var j = 0; j < rec.output.liquids.length; j++) {
                    var stack = rec.output.liquids[j];
                    inputTable.image(stack.liquid.uiIcon).size(24).padRight(2);
                    inputTable.add(stack.amount.toFixed(1)).color(Color.yellow).size(16);
                }
                
                if(rec.output.power > 0) {
                    inputTable.image(Icon.power).size(24).padRight(2);
                    inputTable.add((rec.output.power * 60).toFixed(0)).color(Color.yellow).size(16);
                }
            })).padLeft(10);
        })).fillX().row();
    }
};
this.configured = function(player, value) {
        if(isNaN(value) || typeof value != "number") {
            this._toggle = -1;
            this._cond = false;
            this._condValid = false;
            return;
        };
        var current = this._toggle;
        if(current >= 0) this.progressArr[current] = this.progress;
        if(value == -1) {
            this._condValid = false;
            this._cond = false;
        };
        if(this.block.doDumpToggle()) {
            this.toOutputItemSet.clear();
            this.toOutputLiquidset.clear();
            if(value > -1) {
                var oItems = this.block.getRecipes()[value].output.items;
                var oLiquids = this.block.getRecipes()[value].output.liquids;
                for(var i = 0, len = oItems.length; i < len; i++) {
                    var item = oItems[i].item;
                    if(this.items.has(item)) this.toOutputItemSet.add(item);
                };
                for(var i = 0, len = oLiquids.length; i < len; i++) {
                    var liquid = oLiquids[i].liquid;
                    if(this.liquids.get(liquid) > 0.001) this.toOutputLiquidset.add(liquid);
                };
            };
        };
        this.progress = 0;
        this._toggle = value;
    };
    this.onConfigureTileTapped = function(other) {
        return this.items.total() > 0 ? true : this != other;
    };
    
    this.getToggle = function() {
        return this._toggle;
    };
    this._toggle = 0;
    this._Direction = 0;
    this.getDirection = function() {
        return this._Direction;
    };
    this.progressArr = [];
    this.getCond = function() {
        return this._cond;
    };
    this._cond = false;
    this._condValid = false;
    this.getCondValid = function() {
        return this._condValid;
    };
    this.getPowerStat = function() {
        return this._powerStat;
    };
    this._powerStat = 0;
    this.toOutputItemSet = new OrderedSet();
    this.toOutputLiquidset = new OrderedSet();
    this.dumpItemEntry = 0;
    this.itemHas = 0;
    this.config = function() {
        return this._toggle;
    };
    this.write = function(write) {
        this.super$write(write);
        write.s(this._toggle);
        write.i(this._Direction);
        var queItem = this.toOutputItemSet.orderedItems(),
            len = queItem.size;
        write.s(len);
        for(var i = 0; i < len; i++) write.s(queItem.get(i).id);
        var queLiquid = this.toOutputLiquidset.orderedItems(),
            len = queLiquid.size;
        write.s(len);
        for(var i = 0; i < len; i++) write.s(queLiquid.get(i).id);
    };
    this.read = function(read, revision) {
        this.super$read(read, revision);
        this._toggle = read.s();
        this._Direction = read.i();
        this.toOutputItemSet.clear();
        this.toOutputLiquidset.clear();
        var len = read.s(),
            vc = Vars.content,
            ci = ContentType.item,
            cl = ContentType.liquid;
        for(var i = 0; i < len; i++) this.toOutputItemSet.add(vc.getByID(ci, read.s()));
        var len = read.s();
        for(var i = 0; i < len; i++) this.toOutputLiquidset.add(vc.getByID(cl, read.s()));
    };
}

function MultiCrafterBlock() {
    this.tmpRecs = [];
    var recs = [];
    var infoStyle = null;
    this.getRecipes = function() {
        return recs;
    };
    this._liquidSet = new ObjectSet();
    this.getLiquidSet = function() {
        return this._liquidSet;
    };
    this.hasOutputItem = false;
    this._inputItemSet = new ObjectSet();
    this.getInputItemSet = function() {
        return this._inputItemSet;
    };
    this._inputLiquidSet = new ObjectSet();
    this.getInputLiquidSet = function() {
        return this._inputLiquidSet;
    };
    this._outputItemSet = new ObjectSet();
    this.getOutputItemSet = function() {
        return this._outputItemSet;
    };
    this._outputLiquidSet = new ObjectSet();
    this.getOutputLiquidSet = function() {
        return this._outputLiquidSet;
    };
    this.dumpToggle = false;
    this.doDumpToggle = function() {
        return this.dumpToggle;
    };
    this.powerBarI = false;
    this.powerBarO = false;
    this._invFrag = extend(BlockInventoryFragment, {
        _built: false,
        isBuilt() {
            return this._built;
        },
        visible: false,
        isShown() {
            return this.visible;
        },
        showFor(t) {
            this.visible = true;
            this.super$showFor(t);
        },
        hide() {
            this.visible = false;
            this.super$hide();
        },
        build(parent) {
            this._built = true;
            this.super$build(parent);
        }
    });
    this.getInvFrag = function() {
        return this._invFrag;
    };
    this.init = function() {
        for(var i = 0; i < this.tmpRecs.length; i++) {
            var tmp = this.tmpRecs[i];
            var isInputExist = tmp.input != null;
            var isOutputExist = tmp.output != null;
            var tmpInput = tmp.input;
            var tmpOutput = tmp.output;
            if(isInputExist && tmpInput.power > 0) this.powerBarI = true;
            if(isOutputExist && tmpOutput.power > 0) this.powerBarO = true;
            recs[i] = {
                input: {
                    items: [],
                    liquids: [],
                    power: isInputExist ? typeof tmpInput.power == "number" ? tmpInput.power : 0 : 0
                },
                output: {
                    items: [],
                    liquids: [],
                    power: isOutputExist ? typeof tmpOutput.power == "number" ? tmpOutput.power : 0 : 0
                },
                stages: tmp.stages || [],
                craftTime: typeof tmp.craftTime == "number" ? tmp.craftTime : 80,
                group: tmp.group || "group",
                title: tmp.title || "配方"
            };
            var vc = Vars.content;
            var ci = ContentType.item;
            var cl = ContentType.liquid;
            var realInput = recs[i].input;
            var realOutput = recs[i].output;
            if(isInputExist) {
                if(tmpInput.items != null) {
                    for(var j = 0, len = tmpInput.items.length; j < len; j++) {
                        var words = tmpInput.items[j].split("/");
                        var item = vc.getByName(ci, words[0]);
                        this._inputItemSet.add(item);
                        realInput.items[j] = new ItemStack(item, words[1] * 1);
                    };
                };
                if(tmpInput.liquids != null) {
                    for(var j = 0, len = tmpInput.liquids.length; j < len; j++) {
                        var words = tmpInput.liquids[j].split("/");
                        var liquid = vc.getByName(cl, words[0]);
                        this._inputLiquidSet.add(liquid);
                        this._liquidSet.add(liquid);
                        realInput.liquids[j] = new LiquidStack(liquid, words[1] * 1);
                    };
                };
            };
            if(isOutputExist) {
                if(tmpOutput.items != null) {
                    for(var j = 0, len = tmpOutput.items.length; j < len; j++) {
                        var words = tmpOutput.items[j].split("/");
                        var item = vc.getByName(ci, words[0]);
                        this._outputItemSet.add(item);
                        realOutput.items[j] = new ItemStack(item, words[1] * 1);
                    };
                    if(j != 0) this.hasOutputItem = true;
                };
                if(tmpOutput.liquids != null) {
                    for(var j = 0, len = tmpOutput.liquids.length; j < len; j++) {
                        var words = tmpOutput.liquids[j].split("/");
                        var liquid = vc.getByName(cl, words[0]);
                        this._outputLiquidSet.add(liquid);
                        this._liquidSet.add(liquid);
                        realOutput.liquids[j] = new LiquidStack(liquid, words[1] * 1);
                    };
                };
            };
        };
        this.hasPower = this.powerBarI || this.powerBarO;
        if(this.powerBarI) this.consumeBuilder.add(extend(ConsumePower, {
            requestedPower(entity) {
                if(typeof entity["getToggle"] !== "function") return 0;
                var i = entity.getToggle();
                if(i < 0) return 0;
                var input = entity.block.getRecipes()[i].input.power;
                if(input > 0 && entity.getCond()) return input;
                return 0;
            }
        }));
        this.consumesPower = this.powerBarI;
        this.outputsPower = this.powerBarO;
        this.super$init();
        if(!this._outputLiquidSet.isEmpty()) this.outputsLiquid = true;
        this.timers++;
        if(!Vars.headless) infoStyle = Core.scene.getStyle(Button.ButtonStyle);
    };
    
    this.setStats = function() {
        this.super$setStats();
        if(this.powerBarI) this.stats.remove(Stat.powerUse);
        this.stats.remove(Stat.productionTime);
        this.stats.add(Stat.input, new JavaAdapter(StatValue, {
        display(table){
        var groupedRecs = {};
        var defaultGroupCounter = 0;
        for (var i = 0; i < recs.length; i++) {
                var rec = recs[i];
                if (rec.group == "group") {
                    rec.group = "@group" + defaultGroupCounter.toString();
                    defaultGroupCounter++;
                }
                if (!groupedRecs[rec.group]) {
                    groupedRecs[rec.group] = [];
                }
                groupedRecs[rec.group].push(rec);
            }
        table.row();
        for (var groupName in groupedRecs) {
            var groupRecs = groupedRecs[groupName];
            table.table(Styles.grayPanel, function(groupTable) {
                if (groupName.indexOf("@group") !== 0) {
                    groupTable.add("[accent]" + groupName).left().row();
                    groupTable.add().size(8).row();
                }
                for (var j = 0; j < groupRecs.length; j++) {
                    var rec = groupRecs[j];
                    var outputItems = rec.output.items;
                    var inputItems = rec.input.items;
                    var outputLiquids = rec.output.liquids;
                    var inputLiquids = rec.input.liquids;
                    var inputPower = rec.input.power;
                    var outputPower = rec.output.power;
                    groupTable.table(Styles.none, function(part) {
                        part.defaults().pad(2);
                        part.add("[accent]  [" + rec.title + "]").left().row();
                        part.add().size(5).row();
                        part.table(cons(function(row) {
                            row.add("[lightgray]    " + Stat.input.localized() + ":[]").left().padRight(8);
                            for (var l = 0; l < inputItems.length; l++) 
                                row.add(new StatValues.displayItem(inputItems[l].item, inputItems[l].amount, true)).padRight(5);
                                row.add(" || ").padRight(5);
                            for (var l = 0; l < inputLiquids.length; l++) 
                                row.add(new StatValues.displayLiquid(inputLiquids[l].liquid, inputLiquids[l].amount, false)).padRight(5);
                        })).left().row();
                        part.table(cons(function(row) {
                            row.add("[lightgray]    " + Stat.output.localized() + ":[]").left().padRight(8);
                            for (var jj = 0; jj < outputItems.length; jj++) 
                                row.add(new StatValues.displayItem(outputItems[jj].item, outputItems[jj].amount, true)).padRight(5);
                                row.add(" || ").padRight(5);
                            for (var jj = 0; jj < outputLiquids.length; jj++) 
                                row.add(new StatValues.displayLiquid(outputLiquids[jj].liquid, outputLiquids[jj].amount, false)).padRight(5);
                        })).left().row();
                        if (inputPower > 0 || outputPower > 0) {
                            part.table(cons(function(row) {
                                if (inputPower > 0) {
                                    row.add("[lightgray]    " + Stat.powerUse.localized() + ":[]").padRight(4);
                                    (StatValues.number(rec.input.power * 60, StatUnit.powerSecond)).display(row);
                                    row.add().size(10);
                                }
                                if (outputPower > 0) {
                                    row.add("[lightgray]    " + Stat.basePowerGeneration.localized() + ":[]").padRight(4);
                                    (StatValues.number(rec.output.power * 60, StatUnit.powerSecond)).display(row);
                                }
                            })).left().row();
                        }
                        part.table(cons(function(row) {
                            row.add("[lightgray]    " + Stat.productionTime.localized() + ":[]").padRight(4);
                            (StatValues.number(rec.craftTime / 60, StatUnit.seconds)).display(row);
                        })).pad(5).left().row();
                        if (typeof this["customDisplay"] === "function") this.customDisplay(part, j);
                        if (rec.stages.length > 0) {
                            part.add("[white]  阶段工艺").left().row();
                            part.table(cons(function(row) {
                                for (var s = 0; s < rec.stages.length; s++) {
                                    var stage = rec.stages[s];
                                    row.add().size(5).row();
                                    var minorIndex = stage.title.indexOf("@minor");
                                    if (minorIndex >= 0) {
                                        var beforeMinor = stage.title.substring(0, minorIndex);
                                        var afterMinor = stage.title.substring(minorIndex + 6);
                                        row.add("[lightgray]    " + beforeMinor + "[gray]" + afterMinor + "[]").left().row();
                                    } else {
                                        row.add("[lightgray]    " + stage.title + "[]").left().row();
                                    }
                                    if (stage.input && stage.input.length > 0) {
                                        row.add("[grey]      " + stage.input.join(" + ") + " ==> " + stage.output.join(" + ")).left().row();
                                    }
                                }
                            })).left().row();
                        }
                    }).pad(5).left().row();
                }
            }).pad(10).left().row();
            table.add().size(18).row();
            }},
        }));
    };

    this.setBars = function() {
        this.super$setBars();
        this.removeBar("liquid");
        this.removeBar("items");
        if(!this.powerBarI && this.hasPower) this.removeBar("power");
        if(this.powerBarO) this.addBar("poweroutput", entity => new Bar(() => Core.bundle.format("bar.poweroutput", entity.getPowerProduction() * 60 * entity.timeScale), () => Pal.powerBar, () => typeof entity["getPowerStat"] === "function" ? entity.getPowerStat() : 0));
        var i = 0;
        
        this.addBar("newBar", 
            entity => new Bar(
                () => "当前配方制造进度: " + Math.floor(entity.progress * 100) + "%",
                () => Color.valueOf("ffb000"),
                () => entity.progress / 1
            )
        );
        
        this.addBar("stageBar", 
            entity => new Bar(
                () => {
                   if (entity.config() >= 0) {
                       var Stages = recs [entity.config()].stages.length;
                       var stageWeights = 0;
                       if ( Stages >= 1) {
                       for (var ja = 0 ; ja < Stages ; ja++){
                           if (recs[entity.config()].stages[ja].weight != null) {var stageWeight = recs[entity.config()].stages[ja].weight}else{var stageWeight = 10};
                           var stageWeights = stageWeights + stageWeight;
                       }
                       var stageProgress = entity.progress * stageWeights;
                       var sta = 0;
                       for (var jb = 0; jb < Stages; jb++){
                           if (recs[entity.config()].stages[jb].weight != null) {var stageWeight = recs[entity.config()].stages[jb].weight}else{var stageWeight = 10};
                           var st = sta + stageWeight;
                           if (stageProgress < st){
                               if (recs[entity.config()].stages[jb].bartitle !== undefined){var stageBarView = recs[entity.config()].stages[jb].bartitle}else{var stageBarView = "处理工艺..."};
                               break
                           }else{
                               var sta = sta + stageWeight;
                           }
                       }
                       return stageBarView + " [" + (jb + 1) + "/" + Stages + "]";
                       }else{
                           return "[工艺保密]";
                       }
                   } else {
                       return "空闲";
                   }
                },
                () => Color.valueOf("ffb000"),
                () => {
                   if (entity.config() >= 0) {
                       var Stages = recs [entity.config()].stages.length;
                       var stageWeights = 0;
                       if ( Stages >= 1) {
                       for (var ja = 0 ; ja < Stages ; ja++){
                           if (recs[entity.config()].stages[ja].weight != null) {var stageWeight = recs[entity.config()].stages[ja].weight}else{var stageWeight = 10};
                           var stageWeights = stageWeights + stageWeight;
                       }
                       var stageProgress = entity.progress * stageWeights;
                       var sta = 0;
                       for (var jb = 0; jb < Stages; jb++){
                           if (recs[entity.config()].stages[jb].weight != null) {var stageWeight = recs[entity.config()].stages[jb].weight}else{var stageWeight = 10};
                           var st = sta + stageWeight;
                           if (stageProgress < st){
                               var stageBarNumber = (stageProgress - st + stageWeight) / stageWeight;
                               break
                           }else{
                               var sta = sta + stageWeight;
                           }
                       }
                       return stageBarNumber;
                       }else{
                           return 0;
                       }
                   } else {
                       return 0;
                   }
                },
            )
        );
        
        if(!this._liquidSet.isEmpty()) {
            this._liquidSet.each(k => {
                this.addBar("liquid" + i, entity => new Bar(() => k.localizedName, () => k.barColor == null ? k.color : k.barColor, () => entity.liquids.get(k) / this.liquidCapacity));
                i++;
            });
        }
    };
    
    this.outputsItems = function() {
        return this.hasOutputItem;
    };
}

function cloneObject(obj) {
    var clone = {};
    for(var i in obj) {
        if(typeof obj[i] == "object" && obj[i] != null) clone[i] = cloneObject(obj[i]);
        else clone[i] = obj[i];
    }
    return clone;
}

module.exports = {
    MultiCrafter(Type, EntityType, name, recipes, def, ExtraEntityDef) {
        const block = new MultiCrafterBlock();
        Object.assign(block, def);
        const multi = extend(Type, name, block);
        multi.buildType = () => extend(EntityType, multi, Object.assign(new MultiCrafterBuild(), typeof ExtraEntityDef == "function" ? new ExtraEntityDef() : cloneObject(ExtraEntityDef)));
        multi.configurable = true;
        multi.hasItems = true;
        multi.hasLiquids = true;
        multi.hasPower = true;
        multi.tmpRecs = recipes;
        multi.saveConfig = true;
        return multi;
    }
}