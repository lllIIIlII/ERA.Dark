exports.modName = "ed"

exports.mod = Vars.mods.locateMod(exports.modName);
//新旧模组检测替换
//以下为科技树部分
exports.addToResearch = (content, research) => {
	if (!content) {
		throw new Error('content is null!');
	}
	if (!research.parent) {
		throw new Error('research.parent is empty!');
	}
	var researchName = research.parent;
	var customRequirements = research.requirements;
	var objectives = research.objectives;

	var lastNode = TechTree.all.find(boolf(t => t.content == content));
	if (lastNode != null) {
		lastNode.remove();
	}

	var node = new TechTree.TechNode(null, content, customRequirements !== undefined ? customRequirements : content.researchRequirements());
	var currentMod = exports.mod;
	if (objectives) {
		node.objectives.addAll(objectives);
	}

	if (node.parent != null) {
		node.parent.children.remove(node);
	}

	//寻找父级节点
	var parent = TechTree.all.find(boolf(t => t.content.name.equals(researchName) || t.content.name.equals(currentMod.name + "-" + researchName)));

	if (parent == null) {
		throw new Error("Content '" + researchName + "' isn't in the tech tree, but '" + content.name + "' requires it to be researched.");
	}

	//添加子节点
	if (!parent.children.contains(node)) {
		parent.children.add(node);
	}
	//重定父级
	node.parent = parent;
};

const urlLoader = Packages.java.net.URLClassLoader([Vars.mods.getMod(modName).file.file().toURI().toURL()], Vars.mods.mainLoader());
exports.getClass = function (name){
    return Packages.rhino.NativeJavaClass(Vars.mods.scripts.scope, urlLoader.loadClass(name));
}
//这可是导入文件文件
exports.loadSound = function (name, setter) {//调取其中的音频
    const params = new Packages.arc.assets.loaders.SoundLoader.SoundParameter();
    params.loadedCallback = new Packages.arc.assets.AssetLoaderParameters.LoadedCallback({
        finishedLoading(asset, str, cls) {
            // print('1 load sound ' + name + ' from arc');
            setter(asset.get(str, cls));
        }
    });

    Core.assets.load("sounds/" + name, Packages.arc.audio.Sound, params).loaded = new Cons({
        get(a) {
            // print('2 load sound ' + name + ' from arc');
            setter(a);
        }
    });
}

exports.newEffect = (lifetime, renderer) => new Effect(lifetime, cons(renderer));//建造新对象  只接受持续时间(lifetime)与渲染器(renderer)  cons(renderer)  可能是一个辅助函数，用于构造或包装  renderer  参数

exports.cons2 = (func) => new Cons2({ get: (v1, v2) => func(v1, v2) });//这个函数创建一个新的  Cons2  对象，它接受一个函数  func  作为参数，并在内部使用这个函数作为  get  方法的回调
exports.floatc2 = (func) => new Floatc2({ get: (v1, v2) => func(v1, v2) });//这个函数创建一个新的  Floatc2  对象，它接受一个函数  func  作为参数，并在内部使用这个函数作为  get  方法的回调
exports.boolf2 = (func) => new Boolf2({ get: (v1, v2) => func(v1, v2) });//这个函数创建一个新的  Boolf2  对象，它接受一个函数  func  作为参数，并在内部使用这个函数作为  get  方法的回调
exports.func = (getter) => new Func({ get: getter });//这个函数创建一个新的  Func  对象，它接受一个  getter  函数作为参数，并直接将其用作  get  方法的回调
exports.raycaster = (func) => new Geometry.Raycaster({ accept: func });//这个函数创建一个新的  Raycaster  对象，它接受一个函数  func  作为参数，并将其用作  accept  方法的回调
exports.intc = (func) => new Intc({ get: func });//这个函数创建一个新的  Intc  对象，它接受一个函数  func  作为参数，并将其用作  get  方法的回调
exports.intc2 = (func) => new Intc2({ get: func });//这个函数创建一个新的  Intc2  对象，它接受一个函数  func  作为参数，并将其用作  get  方法的回调
exports.floatf = (func) => new Floatf({ get: func });//这个函数创建一个新的  Floatf  对象，它接受一个函数  func  作为参数，并将其用作  get  方法的回调

exports.loadRegion = (name) => {//这行代码定义了一个名为   loadRegion   的函数，它接受一个参数   name  ，这个参数可能是用来指定要加载的区域或资源的名称
    if (Vars.headless === true) {//这行代码检查一个名为   Vars   的对象中的   headless   属性是否为   true  。如果   headless   为   true  ，则函数会立即返回   null  。  headless   模式通常指的是不依赖于图形界面的服务器模式，因此，在这种模式下，加载图形资源是不必要的
        return null
    }
    return Core.atlas.find(exports.modName + '-' + name, "error") 
};//如果   headless   不是   true  ，则函数会尝试通过   Core.atlas   对象的   find   方法来加载区域。这个方法接受两个参数：第一个参数是资源的名称，这里通过连接   exports.modName  （模块名称）和传入的   name   参数来构造；第二个参数是当资源找不到时的默认值，这里设置为   "error"  

/**
 * @param {Block} blockType The block type
 * @param {(block: Block) => Building} buildingCreator
 *        A function receives block type, return Building instance;
 *        don't use prov (this function will use prov once)
 */
exports.setBuilding = function(blockType, buildingCreator) {//这行代码定义了一个名为   setBuilding   的函数，并且将其导出。这个函数接受两个参数
    blockType.buildType = prov(() => buildingCreator(blockType));//block Type：一个代表可建造建筑块的类型的对象  buildingCreator  ：一个函数，用于创建或定义如何构建   blockType  给上一个赋值
}

/**
 * @param {Block} blockType The block type
 * @param {Class<Building>} buildingType The building type
 * @param {Object} overrides Object that as second parameter of extend()
 */
exports.setBuildingSimple = function(blockType, buildingType, overrides) {
    blockType.buildType = prov(() => new JavaAdapter(buildingType, overrides, blockType));
}//与上方一样，也是赋值

/**
 * Get message from bundle.
 * @param {string} type the prefix such as block, unit, mech
 * @param
 */
exports.getMessage = function(type, key) {
    return Core.bundle.get(type + "." + exports.modName + "." + key);
}//这个也是赋值

exports.int = (v) => new java.lang.Integer(v);//创建一个新主体，并调用Java

exports.createProbabilitySelector = function() {//这又是赋值调用
    const objects = [];//指明用来储存的对象
    const probabilities = [];//声明了一个常用值，用来和上一条进行相互关联的概率
    var maxProbabilitySum = 0;//这个变量的开始为0

    return {
        showProbabilities() {
            const p = [];
            var previous = 0;
            for (var i = 0; i < probabilities.length; i++) {
                var current = probabilities[i];
                p.push(parseFloat(((current - previous) / maxProbabilitySum).toFixed(5)))
                previous = current;
            }
            return p;
        },
        add(obj, probability) {
            if (!Number.isInteger(probability)) {
                throw "'probability' must integer."
            }
            maxProbabilitySum += probability;
            objects.push(obj);
            probabilities.push(maxProbabilitySum);
        },
        random: function() {
            const random = Math.floor(Math.random() * maxProbabilitySum);
            // Can use binary search
            for (var i = 0; i < probabilities.length; i++) {
                var max = probabilities[i];
                if (random < max) {
                    return objects[i];
                }
            }
            throw "IMPOSSIBLE!!! THIS IS A BUG"
        }
    }
}//这一整大段都是自主查错报告
//弥补js无法自主查错的缺点