modules.define('keyboard', [
            'jquery',
            'BEMHTML',
            'i-bem__dom'
        ], function (
                provide,
                $,
                BEMHTML,
                BEMDOM) {

/**
 * Виртуальная клавиатура
 *
 * Отправляет на window события:
 *   - keyboardLangChanged: поменялся язык клавиатуры
 *                               в следствие действий пользователя
 *
 * Слушает на window события:
 *   - keyboardSetLang: установить новый язык клавиатуры
 */

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function () {
                var params = this.params,
                    keyboard = this,
                    page = keyboard.findBlockOutside('page');

                keyboard._keys = keyboard.findElem('inner').data('keys');
                keyboard._langs = keyboard.findElem('inner').data('langs');
                keyboard._allowedLangs = keyboard.findElem('inner').data('allowed');

                // Блокируем выделение текста внутри блока
                keyboard.domElem[0].onmousedown = function() {return false;};
                keyboard.domElem[0].onselectstart = function() {return false;};

                page.on('keyboardSetLang', function(e, lang) {
                    this.setMod('lang', lang);
                });

                var $doc = $(document),
                    $body = $(document.body),
                    $inputs = $('input, textarea')
                                    .filter(this._isTextInput)
                                    .filter(':visible'),
                    onClickOrFocus = keyboard._onClickOrFocus.bind(this);


                /**
                 * Привязываем клавиатуру к полю с активным фокусом.
                 * mouseup нужен для ловли выделения.
                 */
                $body.bind('mouseup', onClickOrFocus);
                $doc.on('focus', 'input', onClickOrFocus);

                // keyup нужен для ловли ввода символов с клавиатуры и
                // правильного выставления фокуса после этого
                $body.bind('keyup', function(e) {

                    var trg = e.target;

                    if(!keyboard._isTextInput(trg)) {
                        return false;
                    }

                    if(keyboard.targetField && e.keyCode) {
                        $(keyboard.targetField).saveCaretPos();
                    }
                });

                // Защита от кражи фокуса из активного поля ввода при
                // промахивании мимо клавиши
                keyboard.domElem.click(function(e) {
                    if(!$(e.target).is(keyboard.findElem('key'))) {
                        keyboard.targetField && keyboard.targetField.setCaretPos();
                    }
                });

                // Привязываем клавиатуру к текущему полю ввода
                $inputs.filter(':focus').each(function() {
                    var elem = $(this);

                    elem.saveCaretPos();
                    keyboard.targetField = elem;

                    return false;
                });
            }
        },
        lang: function (modName, modVal) {
            this.setMod('mode', 'normal');
            this._switchLayout(modVal, 'normal');
            $(window).trigger('keyboardLangChanged', modVal);
        },
        mode: function (modName, modVal) {
            this._switchLayout(this.getMod('lang'), modVal);
        }
    },

    _keyclick: function ($key) {
        var keyboard = this,
            $targetField = this.targetField,
            type = keyboard.getMod($key, 'special') || 'normal',
            keys = keyboard._keys;

        if(keyboard.hasMod($key, 'disabled')) return;

        // переключаем режим
        var currMode = keyboard.getMod('mode'),
            keyMode = $key.data('mode'),
            isCurrModeContinuous = keys[currMode].continuous,
            currRetreat = keys[currMode].retreat || 'normal',
            newMode = (isCurrModeContinuous && !keyMode) ?
                                                    currMode :
                                                        (keyMode || currRetreat);

        if (currMode === keyMode) {
            newMode = currRetreat;
        }

        keyboard.setMod('mode', newMode);

        // если нажали экранный Enter в текстовом поле - сабмитим форму
        if($targetField && (type === 'enter')) {
            if($targetField[0].tagName.toLowerCase() === 'input') {
                try { $($targetField[0].form).submit(); } catch(e) {}
                return;
            }
        }
    },

    _keymousedown: function ($key) {
        var keyboard = this,
            $targetField = this.targetField,
            type = keyboard.getMod($key, 'special') || 'normal';

        if(keyboard.hasMod($key, 'disabled')) return;

        keyboard.setMod($key, 'pressed', true);

        if(!$key || !$targetField) return;

        // Получаем набранный символ
        var keyValue = $key
                        .find(keyboard
                        .findElem('val'))
                        .html() || ''
                        .replace(this.unescapeHTMLRe, function(s, c, d) {
                return keyboard.unescapeHTMLHash[d] ||
                        (d ? String.fromCharCode(d.substring(1)) : c);
            });

        // Устанавливаем значение с учетом положения каретки

        if(type !== 'backspace') {
            if(type === 'enter') {
                if ($targetField[0].tagName.toLowerCase() === 'input'){
                    return;
                } else {
                    keyValue = '\n';
                }
            }
            $targetField.insertAtCaretPos(keyValue);
            $targetField.trigger('input');
        } else {
            $targetField.deleteAtCaretPos();
            $targetField.trigger('input');
        }

        // Автоповтор

        if($key.data('mode')) {
            // Если спец. клавиша, меняющая режим - автоповтор не нужен, заканчиваем
            return;
        }

        if(!keyboard._hold) {
            var timeout = 500;
            keyboard._hold = true;
        } else {
            var timeout = 120;
        }

        keyboard._holdTimeout = window.setTimeout(function() {
            keyboard._keymousedown($key);
        }, timeout);
    },

    _keymouseup: function ($key) {
        this.delMod($key, 'pressed');

        this.targetField && $(this.targetField).keyup();

        // Выключаем автоповтор
        this.clearHold();
    },

    _keymouseout: function ($key) {
        // Защита от залипания подсветки нажатой клавиши
        this.delMod($key, 'pressed');
        this.clearHold();
    },

    targetField: null,

    _holdTimeout: null,
    _hold: false,

    clearHold: function() {
        this._hold = false;
        clearTimeout(this._holdTimeout);
    },

    unescapeHTMLRe: /(&(lt|gt|quot|apos|amp|#\d+);|.)/gi,
    unescapeHTMLHash: {lt: '<', gt: '>', quot: '"', apos: "'", amp: '&'},

    /**
     * Проверяет, является ли переданный элемент текстовым полем
     * @private
     * @param {DOMElement} elm
     */
    _isTextInput: function(elm) {
        // может быть передана как параметр в $.filter
        if(!elm || !elm.tagName) {
            elm = this;
        }

        return  (/^input$/i.test(elm.tagName) && !!~[
                'text',
                'search',
                'password',
                'email',
                'number',
                'tel',
                'url'
            ].indexOf(elm.type)) ||
                (/^textarea$/i.test(elm.tagName));
    },

    _switchLayout: function(lang, mode) {
        var keyboard = this;
        setTimeout(function () {

            BEMDOM.replace(keyboard.findElem('inner'), BEMHTML.apply({
                block: 'keyboard',
                elem: 'inner',
                lang: lang,
                mode: mode,
                allowedLangs: keyboard._allowedLangs
            }));

            keyboard._keys = keyboard.findElem('inner').data('keys');

        }, 0);
    },

    /**
     * Обрабатывает события mouseup и focus
     * @private
     * @param {DOMEvent} e
     */
    _onClickOrFocus: function(e) {
        var trg = e.target;

        if(!this._isTextInput(trg)) {
            return false;
        }

        this.targetField = $(trg);

        // IE имеет странное поведение на domElem.focus() и выставляет его
        // в начало строки.
        // Это можно отсечь с помощью проверки e.target == e.srcElement.
        // В этом случае принудительно выставляем фокус в конец строки.
        if(e.type === 'focusin' && e.target === e.srcElement) {
            $(trg).setCaretPos(trg.value.length);
        } else {
            setTimeout(function () {
                $(trg).saveCaretPos();
            }, 50);
        }
    }

}, {

    live : function() {
        this.liveBindTo('key', 'click mouseup mousedown mouseout', function (e) {
            // Only allow left-button click
            if(e.which && e.which !== 1 || e.button && e.button !== 1) return;
            this['_key' + e.type](e.currentTarget);
        });
    }

}));

});
