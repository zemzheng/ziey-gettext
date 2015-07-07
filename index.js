/**
 * @author zemzheng@gmail.com (http://www.ziey.info)
 * Copyright (c) 2015-05-20 Zem Zheng
 */

var fs = require('fs');

var DICT = {
    // "lang" : {
    //      "<msgid>" : {
    //          "reference" : [],
    //          "str" : "<msgstr>"
    //      }
    // }
};

var c_lang,
    c_dict;

function po2obj( text ){
    text = text.split( /[\r\n]/g );
    var line, 
        m, c, 
        match, current,
        temp,
        obj = {},
        result = {},
        getObj = function(){
            if( obj.msgid ){
                result[ obj.msgid ] = {
                    reference : obj.reference,
                    str       : obj.msgstr
                }
            }
            current = obj.msgid = obj.msgstr = '';
            obj.reference = {};
        };
    getObj();
    while( text.length ){
        // 清理空行
        line = text.shift().replace( /^\s*|\s*$/g, '' );

        if( match = line.match( /^#:\s+(.+)$/ ) ){
            // 注释，引用的文件
            obj.reference[ match[1] ] = 1;
        } else if( match = line.match( /^(msgid|msgstr)\s+(".*")$/ ) ){
            // 匹配到 msgid 或者 msgstr
            if( "msgid" == match[1] && "msgstr" == current ){
                // 遇到新的 msgid，先收尾
                getObj();
            }
            // 获取内容，该转义转义
            obj[ match[1] ] = JSON.parse( '{"' + match[1] + '" : ' + match[2] + '}' )[ match[1] ];
            // 打个标志
            current = match[1];
        } else if( ( match = line.match( /^(".+")$/ ) ) && current ){
            // 换行
           obj[ current ]  += JSON.parse( '{"content" : ' + match[1] + '}' )[ "content" ];
        } else {
            getObj();
        }
    }
    getObj();
    return result;
}

function obj2po( obj, header ){
    var potxt = [
            'msgid ""',
            'msgstr ""',
            '"MIME-Version: 1.0\\n"',
            '"Content-Type: text/plain; charset=UTF-8\\n"',
            '"Content-Transfer-Encoding: 8bit\\n"'
        ].concat( header || [] ).join('\n'),
        pobody = [],
        item,
        key;
    for (key in obj) {
        item = obj[ key ];
        pobody.push( (function(){
            var list = (function( reference ){
                    var result = [], key, prefix = "\n#: ";
                    if( !reference ) return result;
                    for( key in reference ){
                        result.push( key );
                    }
                    result.sort();
                    return prefix + result.join( prefix );
                })( item.reference );
            return [
                    list,
                    'msgid '  + JSON.stringify( key ),
                    'msgstr ' + ( item.str ? JSON.stringify( item.str ) : '""' ),
                    ''
                ].join( "\n" )
        })() );
    }
    pobody.sort();

    return potxt + '\n' + pobody.join( '\n' );

}

function handlePo( lang, path ){
    return handlePoTxt( lang, fs.readFileSync( path, 'utf-8' ) );
}

function handlePoTxt( lang, text ){
    if( lang ){
        return DICT[ lang ] = po2obj( text );
    }
}

function getDictByLang( lang ){
    return DICT[lang];
};


function getLang(){ return c_lang; }
function setLang( lang ){
    if( lang in DICT ){
        c_dict = getDictByLang( lang );
    }
}

function updateCurrentDict( id, opts ){
    var item;
    if( !( item = c_dict[ id ] ) ){
        item = {
            str : '',
            reference : {}
        }
    }
    item.str = opts.str || item.str || '';
    item.reference = item.reference || {};
    opts.reference && ( item.reference[ opts.reference ] = 1 );
}

function _( str ){
    var item = c_dict[ str ];
    return ( item && item.str ) ? item.str : str;
}

module.exports = {
    handlePo      : handlePo,
    handlePoTxt   : handlePoTxt,

    _             : _,
    gettext       : _,
    clear         : function() { dict = {}; c_dict = null; },

    setLang           : setLang,
    getDictByLang     : getDictByLang,
    updateCurrentDict : updateCurrentDict,

    po2obj        : po2obj,
    obj2po        : obj2po
}