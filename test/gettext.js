var assert = require("assert");
var gettext = require( '../index.js' );
var fs = require( 'fs' );
var path = require( 'path' );

describe( 'gettext', function(){
    var obj = {
            a : { "reference":{}, str : "A" },
            b : { "reference":{}, str : 'B' },
            z : { "reference":{}, str : '\\z' }
        },
        po = [
            gettext.HEADER,
            '',
            '#:',
            'msgid "a"',
            'msgstr "A"',
            '',
            '',
            '#:',
            'msgid "b"',
            'msgstr "B"',
            '',
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

    it( 'obj2po - 按照 msgid 排序', function(){
        var lang = 'lang' + ( +new Date );
        gettext.handlePoTxt( lang, '' );
        gettext.setLang( lang );

        gettext.updateCurrentDict( 'c' );
        gettext.updateCurrentDict( 'b' );
        gettext.updateCurrentDict( 'a' );
        gettext.updateCurrentDict( 'a', { reference : 'c' } );
        gettext.updateCurrentDict( 'a', { reference : 'b' } );
        gettext.updateCurrentDict( 'c', { reference : 'a' } );
        assert.equal(
            gettext.obj2po( gettext.getDictByLang( lang ) ),
            [
                gettext.HEADER,
                '',
                '#: b',
                '#: c',
                'msgid "a"',
                'msgstr ""',
                '',
                '',
                'msgid "b"',
                'msgstr ""',
                '',
                '',
                '#: a',
                'msgid "c"',
                'msgstr ""',
                ''
            ].join( '\n' )
        );
    } );

    it( 'cleanCurrentDictReference - 清理掉 reference', function(){
        var lang = 'lang' + ( +new Date );
        gettext.handlePoTxt( lang, '' );
        gettext.setLang( lang );

        gettext.updateCurrentDict( 'c' );
        gettext.updateCurrentDict( 'b' );
        gettext.updateCurrentDict( 'a' );
        gettext.updateCurrentDict( 'a', { reference : 'c' } );
        gettext.updateCurrentDict( 'a', { reference : 'b' } );
        gettext.updateCurrentDict( 'c', { reference : 'a' } );

        gettext.cleanCurrentDictReference();

        assert.equal(
            gettext.obj2po( gettext.getDictByLang( lang ) ),
            [
                gettext.HEADER,
                '',
                'msgid "a"',
                'msgstr ""',
                '',
                '',
                'msgid "b"',
                'msgstr ""',
                '',
                '',
                'msgid "c"',
                'msgstr ""',
                ''
            ].join( '\n' )
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

    it( 'load po from file', function(){
        var lang = 'lang',
            po_path = path.join( __dirname, 'lang.po' );
        gettext.handlePo( lang, po_path );
        gettext.setLang( lang );
        assert.equal(
            gettext._( '1.现网更新' ),
            '1.Release online'
        );
        assert.equal(
            gettext._( '2.点击查看更多' ),
            '2.Click to see "More"'
        );
        assert.equal(
            gettext._( '3.他是我们的编辑人员' ),
            "3.He's our editor"
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
                '',
                '',
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

    it( 'updateCurrentDict - 不存在的词条需要加入', function(){
        var lang = 'lang-' + ( +new Date ),
            key = 'key-' + (+new Date ),
            opts = {
                str : 'opts-str-' + (+ new Date )
            };
        gettext.setLang( lang );
        gettext.updateCurrentDict( key, opts );
        assert.equal(
            opts.str,
            gettext.getDictByLang( lang )[ key ].str
        );
    } );

    it( 'clearCurrentDictEmptyItem - 清空当前词典中的空词条', function(){
        var lang = 'lang-' + ( +new Date ),
            obj = {
                a : { "reference":{}, str : "A" },
                b : { "reference":{}, str : 'B' }
            },
            po = [
                'msgid "a"',
                'msgstr "A"',
                'msgid "b"',
                'msgstr ""',
            ].join( '\n' );

        gettext.handlePoTxt( lang, po );
        gettext.setLang( lang );
        gettext.clearCurrentDictEmptyItem();
        assert.equal(
            JSON.stringify( { "reference":{}, str : "A" } ),
            JSON.stringify(
                gettext.getDictByLang( lang ).a
            )
        );
        assert.equal(
            undefined,
            JSON.stringify(
                gettext.getDictByLang( lang ).b
            )
        );
        assert.equal(
            undefined,
            JSON.stringify(
                gettext.getDictByLang( lang ).c
            )
        );
    } );
} );

