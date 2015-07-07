var assert = require("assert");
var gettext = require( '../index.js' );

describe( 'gettext', function(){
    var obj = {
            a : { "reference":{}, str : "A" },
            b : { "reference":{}, str : 'B' },
            z : { "reference":{}, str : '\\z' }
        },
        po = [
            'msgid ""',
            'msgstr ""',
            '"MIME-Version: 1.0\\n"',
            '"Content-Type: text/plain; charset=UTF-8\\n"',
            '"Content-Transfer-Encoding: 8bit\\n"',
            '',
            '#:',
            'msgid "a"',
            'msgstr "A"',
            '',
            '#:',
            'msgid "b"',
            'msgstr "B"',
            '',
            '#:',
            'msgid "z"',
            'msgstr "\\\\z"',
            ''
        ].join( '\n' );
    
    it( 'obj2po', function(){
        assert.equal(
            JSON.stringify( gettext.po2obj( po ) ),
            JSON.stringify( gettext.po2obj( gettext.obj2po( obj ) ) )
        );
    } );
    it( 'po2obj', function(){
        assert.equal(
            JSON.stringify( obj ),
            JSON.stringify( 
                gettext.po2obj( po )
            )
        );
    } );

    it( 'po2obj - 末尾无换行', function(){
        var obj = {
                a : { "reference":{}, str : "A" },
                b : { "reference":{}, str : 'B' }
            },
            po = [
                'msgid "a"',
                'msgstr "A"',
                '','',
                'msgid "b"',
                'msgstr "B"',
            ].join( '\n' );
        assert.equal(
            JSON.stringify( obj ),
            JSON.stringify( 
                gettext.po2obj( po )
            )
        );
    } );

    it( 'po2obj - 多行无间隔', function(){
        var obj = {
                a : { "reference":{}, str : "A" },
                b : { "reference":{}, str : 'B' }
            },
            po = [
                'msgid "a"',
                'msgstr "A"',
                'msgid "b"',
                'msgstr "B"',
            ].join( '\n' );
        assert.equal( 
            JSON.stringify( obj ),
            JSON.stringify( 
                gettext.po2obj( po )
            )
        );
    } );
} );

