modules.define('keyboard', [
            'BEMHTML',
            'i-bem__dom'
        ], function (
                provide,
                BEMHTML,
                BEMDOM) {

provide(BEMDOM.decl(this.name, {}, {

    live : function() {
        this.__base.apply(this, arguments);

        var elem = {elem: 'key', modName: 'special', modVal: 'lang-switcher'};

        this.liveBindTo(elem, 'click', function (e) {
            var keyboard = this,
                currLangId = keyboard.getMod('lang');
                currLangI = 0;

            keyboard._langs.forEach(function (lang, i) {
                if (currLangId === lang.id) currLangI = i;
            });

            var newLangI = currLangI + 1;

            if (newLangI >= keyboard._langs.length) newLangI = 0;

            keyboard.setMod('lang', keyboard._langs[newLangI].id);
        });
    }

}
));

});
