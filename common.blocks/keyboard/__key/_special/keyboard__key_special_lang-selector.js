modules.define('keyboard', [
            'BEMHTML',
            'i-bem__dom'
        ], function (
                provide,
                BEMHTML,
                BEMDOM) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function () {
                this.__base.apply(this, arguments);

                var keyboard = this,
                    popup = BEMDOM.append(this.domElem, BEMHTML.apply({
                        block: 'popup',
                        mix: {
                            block: 'keyboard',
                            elem: 'lang-selector-popup'
                        },
                        mods: {
                            target: 'anchor',
                            theme: 'islands',
                            autoclosable: true
                        },
                        content: {
                            block: 'menu',
                            mods: {
                                theme : 'islands',
                                mode : 'radio',
                                size: 'l',
                                focused : true
                            },
                            content: keyboard._langs.map(function (l) {
                                return {
                                    block : 'menu-item',
                                    val : l.id,
                                    content : l.label
                                };
                            })
                        }
                    })).bem('popup');

                this._langSelectorPopup = popup;

                // переключение языков
                var menu = popup.findBlockInside('menu');

                menu.on('change', function () {
                    keyboard.setMod('lang', menu.getVal());
                    popup.delMod('visible');
                });
            },
            '': function () {
                BEMDOM.destruct(this._langSelectorPopup.domElem);
            }
        }
    }
}, {

    live : function() {
        this.__base.apply(this, arguments);

        var elem = {elem: 'key', modName: 'special', modVal: 'lang-selector'};

        this.liveBindTo(elem, 'click', function (e) {
            var keyboard = this;

            var popup = keyboard._langSelectorPopup;
            popup.setAnchor(e.currentTarget);

            popup
                ._unbindFromAnchorParents()
                ._unbindFromParentPopup()
                ._unbindFromDestructor();

            popup.toggleMod('visible');
        });
    }

}
));

});
