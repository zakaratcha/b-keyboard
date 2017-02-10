([
    {
        shouldDeps: [
            {
                block: 'screen-keyboard',
                mods: {
                    theme: 'eo'
                }
            },
            {
                block: 'screen-keyboard',
                elem: 'inner',
                mods: {
                    lang: [
                        'rus',
                        'eng',
                        'pincode'
                    ]
                }
            },
            {
                block: 'screen-keyboard',
                elem: 'key',
                mods: {
                    special: ['lang-switcher']
                }
            },

            {
                block : 'font',
                elem : 'material-design-iconic-font'
            },
            {
                block : 'font',
                elem : 'ubuntu',
                mods : {
                    face: [
                        'regular',
                        'bold',
                        'italic',
                        'medium'
                    ]
                }
            }
        ]
    }
])
