modules.define('screen-keyboard', [
            'i-bem-dom'
        ], function (
                provide,
                bemDom) {

provide(bemDom.declBlock(this.name, {}, {

    onInit : function() {
        this.__base.apply(this, arguments);

        var elem = {elem: 'key', modName: 'special', modVal: 'lang-switcher'};

        this._domEvents(elem).on('click', function (e) {
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
