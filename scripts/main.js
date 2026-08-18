MapResizeDialog.minSize = 16;
MapResizeDialog.maxSize = 2048;
Vars.renderer.minZoom = 0.1;
Vars.renderer.maxZoom = 100;
Vars.minArmorDamage = 0.2;
ControlPathfinder.showDebug = false;

Events.on(EventType.ClientLoadEvent, cons(e => {
    var dialogo = new BaseDialog("[white]\nThe Dark Age");
    
    dialogo.buttons.button("@close", run(() => {
        dialogo.hide();
    })).size(210, 64);
    
    dialogo.cont.pane(table => {
        table.add(Core.bundle.get("mod.ed.update")).left().labelAlign(Align.left).row();
        table.image(Core.atlas.find("logo")).left().size(450, 100).pad(3).row();
        
        table.add(Core.bundle.get("mod.ed.precautions")).left().growX().wrap().pad(4).labelAlign(Align.left).row();
        table.add(Core.bundle.get("mod.ed.log")).left().growX().wrap().width(400).maxWidth(600).pad(4).labelAlign(Align.left).row();
    }).grow().center().maxWidth(600);
    
    dialogo.cont.button("关注up\n[#00FFFF]Supernova-68", run(() => {
        Core.app.openURI("https://space.bilibili.com/1908743845?spm_id_from=333.1007.0.0");
    })).size(200, 70).pad(2);
    
    dialogo.show();
}));

require("EDitems");
require("EDliquids");
require("blocks/临时核心");
require("blocks/前线指挥中心");
require("blocks/集成炼钢厂");
require("blocks/配液池");
require("blocks/金属精炼厂");
require("damageLimiter");
require("ID");
require("status");
require("sectorSize");
