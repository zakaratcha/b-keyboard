modules.define('jquery', function (provide, jQuery) {

/**
 * jQuery plugin for handling text insertion/deletion at caret position
 * Based on //img.yandex.net/i/keyboardu.js
 * https://yastatic.net/www/2.918/common/blocks/b-keyboard/jquery.fn.caret.js
 */
jQuery.fn.extend({

    /**
     * Saves caret position to data.selection
     */
    saveCaretPos: function() {
        var start,
            end,
            target = this.get(0),
            range;

        if(!('value' in target)) {
            start = end = 0;
        } else if('selectionStart' in target) {
            start = target.selectionStart;
            end = target.selectionEnd;
        } else if(target.createTextRange) { //IE
            if(target.tagName === 'TEXTAREA') {
                // http://the-stickman.com/web-development/javascript/finding-selection-cursor-position-in-a-textarea-in-internet-explorer/
                range = document.selection.createRange();
                // We'll use this as a 'dummy'
                var storedRange = range.duplicate();
                // Select all text
                storedRange.moveToElementText( target );
                // Now move 'dummy' end point to end point of original range
                storedRange.setEndPoint('EndToEnd', range);
                // Now we can calculate start and end points
                start = storedRange.text.length - range.text.length;
                end = start + range.text.length;
            } else {
                range = document.selection.createRange().duplicate();
                range.moveEnd('character', target.value.length);
                if(range.text === '') {
                    start = target.value.length;
                } else {
                    start = target.value.lastIndexOf(range.text);
                }
                range = document.selection.createRange().duplicate();
                range.moveStart('character', -target.value.length);
                end = range.text.length;
            }
        } else {
            start = end = target.value.length;
        }

        if(start >= 0 && end >= 0) {
            this.data('selection', {
                'start': start,
                'end': end
            });
        }
    },

    setCaretPos: function(position) {
        var target = this.get(0);

        if(position >= 0) {
            this.data('selection', {
                'start': position,
                'end': position
            });
        } else {
            position = this.data('selection');
            if(position) {
                position = position.start;
            } else {
                return;
            }
        }

        // Сначала проверяем на ie, тк второй вариант будет работать в ie9+, но неправильно
        if (target.createTextRange) {
            var range = target.createTextRange();
            range.collapse(true);
            range.moveEnd('character', position);
            range.moveStart('character', position);
            range.select();
        } else if (target.setSelectionRange) {
            target.selectionStart = target.selectionEnd = position;
            target.focus();
            target.setSelectionRange(position, position);
        }
    },

    insertAtCaretPos: function(key) {
        var caretPosition = this.data('selection'),
            targetField = this.get(0);

        if(!caretPosition) {
            $(targetField).saveCaretPos();
            caretPosition = this.data('selection');
        }

        var newCaretPosition = caretPosition.start + key.length;

        targetField.value = targetField.value.substring(0, caretPosition.start) + key + targetField.value.substring(caretPosition.end);

        // для ИЕ каретка возвращает через timeout, поэтому тут ее ставить не надо
        if (navigator.userAgent.indexOf('MSIE') > -1) {
            this.data('selection', {
                'start': newCaretPosition,
                'end': newCaretPosition
            });
        } else {
            this.setCaretPos(newCaretPosition);
        }
    },

    deleteAtCaretPos: function() {
        var caretPosition = this.data('selection'),
            targetField = this.get(0),
            newCaretPosition;

        if(caretPosition.start === caretPosition.end) {
            targetField.value = targetField.value.substring(0, caretPosition.start - 1) + targetField.value.substring(caretPosition.end);
            newCaretPosition = caretPosition.start - 1;
            if(newCaretPosition < 0) {
                newCaretPosition = 0;
            }
        } else {
            targetField.value = targetField.value.substring(0, caretPosition.start) + targetField.value.substring(caretPosition.end);
            newCaretPosition = caretPosition.start;
        }

        if (navigator.userAgent.indexOf('MSIE') > -1) {
            this.data('selection', {
                'start': newCaretPosition,
                'end': newCaretPosition
            });
        } else {
            this.setCaretPos(newCaretPosition);
        }

    }
});

provide(jQuery);

});