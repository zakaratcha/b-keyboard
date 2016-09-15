module.exports = {
    block : 'page',
    title : 'Keyboard demo',
    favicon : '/favicon.ico',
    head : [
        { elem : 'meta', attrs : { name : 'description', content : '' } },
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } },
        { elem : 'css', url : 'default.min.css' }
    ],
    scripts: [{ elem : 'js', url : 'default.min.js' }],
    mods : { theme : 'islands' },
    content : [
        {
            block : 'content',
            content : [
                {
                    block : 'input',
                    mods : {
                        theme: 'islands',
                        size: 'xl',
                        'has-clear': true,
                        focused: true
                    },
                    val : '',
                    placeholder : 'placeholder'
                },
                {
                    block: 'keyboard-container',
                    content: {
                        block: 'keyboard',
                        mods: {
                            lang: 'ru'
                        }
                    }
                }
                
            ]
        }
    ]
};
