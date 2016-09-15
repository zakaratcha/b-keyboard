module.exports = {
    block : 'page',
    title : 'Keyboard demo',
    favicon : '/favicon.ico',
    head : [
        { elem : 'meta', attrs : { name : 'description', content : '' } },
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } },
        { elem : 'css', url : 'other.min.css' }
    ],
    scripts: [{ elem : 'js', url : 'other.min.js' }],
    mods : { theme : 'islands' },
    content : [
        {
            block : 'content',
            content : [
                {
                    block: 'textarea',
                    mods: {
                        theme: 'islands',
                        size: 'xl',
                        focused: true
                    },
                    placeholder : 'placeholder'
                },
                {
                    block: 'pincode-container',
                    content: {
                        block: 'keyboard',
                        mods: {
                            theme: 'default',
                            lang: 'pincode'
                        },
                        allowedLangs: [
                            'pincode'
                        ]
                    }
                },
                {
                    block: 'keyboard-container',
                    content: {
                        block: 'keyboard',
                        mods: {
                            theme: 'eo',
                            lang: 'rus'
                        },
                        allowedLangs: [
                            'rus',
                            'eng'
                        ]
                    }
                }
                
            ]
        }
    ]
};
