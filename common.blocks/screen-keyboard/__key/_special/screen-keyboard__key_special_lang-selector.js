modules.define('screen-keyboard', [
            'BEMHTML',
            'popup',
            'menu',
            'i-bem-dom'
        ], function (
                provide,
                BEMHTML,
                Popup,
                Menu,
                bemDom) {

provide(bemDom.declBlock(this.name, {
    onSetMod: {
        js: {
            inited: function () {
                this.__base.apply(this, arguments);

                var keyboard = this,
                    popup = bemDom.append(this.domElem, BEMHTML.apply({
                        block: 'popup',
                        mix: {
                            block: 'screen-keyboard',
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
                                size: 'l'
                            },
                            content: keyboard._langs.map(function (l) {
                                return {
                                    elem : 'item',
                                    val : l.id,
                                    content : l.label
                                };
                            })
                        }
                    })).bem(Popup);

                this._langSelectorPopup = popup;

                // переключение языков
                var menu = popup.findChildBlock(Menu);

//                menu._domEvents({elem: 'item'}).on('mousemove', function () {
//                    menu._domEvents({elem: 'item'}).un('mousemove');
//                });

                menu._events().on('change', function () {
                    keyboard.setMod('lang', menu.getVal());
                    popup.delMod('visible');
                });
            },
            '': function () {
                bemDom.destruct(this._langSelectorPopup.domElem);
            }
        }
    }
}, {

    onInit : function() {
        this.__base.apply(this, arguments);

        var elem = {elem: 'key', modName: 'special', modVal: 'lang-selector'};

        this._domEvents(elem).on('click', function (e) {
            var keyboard = this;

            var popup = keyboard._langSelectorPopup;
            popup.setAnchor(e.bemTarget);

            popup
                ._unbindFromAnchorParents()
                ._unbindFromParentPopup()
                ._unbindFromDestructor();

            popup.toggleMod('visible');

            // пнуть ленивую инициализацию menu
            popup.findChildBlock(Menu).findChildElem('item');

        });
    }

}
));

});
