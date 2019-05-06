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
    function parseContentStr(str){
        return JSON.parse(`{"content":${str}}`).content;
    }
    const result = {};
    let isInMsgStr; // 是否已经进入 msgstr 阶段
    let obj; // 当前在处理的对象

    // #:<file>          // 注释，可选内容
    // msgid "<msgid>"   // 词条
    // "<msgid>"         // 接上一句，可选内容
    // msgstr "<msgstr>" // 翻译
    // "<msgstr>"        // 接上一句，可选内容

    function newObj(){
        if(obj && obj.msgid){
            const { reference = {}, msgid, msgstr = '' } = obj;
            result[msgid] = {
                reference,
                str: msgstr
            };
        }
        obj = {
            msgid: '',
            msgstr: '',
            reference: {},
        };
        isInMsgStr = false;
    }

    newObj();
    text.split( /[\r\n]+/g ).forEach( (oneLine) => {
        const line = oneLine.replace( /^\s*|\s*$/g, '' );
        switch(true){
            case /^#:/.test(line): {
                // 注释
                const [_all, file] = line.match( /^#:\s*(.*)$/ );
                if(isInMsgStr){
                    // 之前已经进入 msgstr，遇到新的注释要收集数据
                    newObj();
                }
                if(file){
                    obj.reference[file] = 1;
                }
                break;
            }
            case /^(msgid|msgstr)/.test(line):{
                // 内容
                const [_all, msgtype, content] = line.match( /^(msgid|msgstr)\s+(".*")$/ );
                currentType = msgtype;
                if('msgstr' === currentType){
                    // 当开始进入 msgstr，翻牌准备收数据
                    isInMsgStr = true;
                } else if(isInMsgStr){
                    // 之前已经进入 msgstr，遇到新的 msgid 要收集数据
                    newObj();
                }
                obj[msgtype] = parseContentStr(content);
                break;
            }
            case /^(".+")$/.test(line):{
                // 继续上一行
                const [all, content] = line.match( /^(".+")$/ )
                obj[currentType] = parseContentStr(content);
                break;
            }
            default: {
                // ignore
            }
        }
    });
    newObj();
    return result;
}


function obj2po( obj ){
    var potxt = module.exports.HEADER,
        list = [],
        item,
        key;
    for (key in obj) {
        item = obj[ key ];
        list.push( (function(){
            var list = (function( reference ){
                    var result = [], key, prefix = "\n#: ";
                    if( !reference ) return result;
                    for( key in reference ){
                        result.push( key );
                    }
                    result.sort();
                    return result.length ? prefix + result.join( prefix ) : ''
                })( item.reference );
            return {
                index : key,
                content : [
                    list,
                    'msgid '  + JSON.stringify( key ),
                    'msgstr ' + ( item.str ? JSON.stringify( item.str ) : '""' ),
                    ''
                ].join( "\n" )
            };
        })() );
    }

    var pobody = [];
    list.sort( function( a, b ){
        return a.index > b.index ? 1 : -1;
    } ).forEach( function( item ){
        pobody.push( item.content );
    } );

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
    c_lang = lang;
    if( lang in DICT ){
        c_dict = getDictByLang( lang );
    } else {
        c_dict = DICT[lang] = {};
    }
}

function updateCurrentDict( id, opts ){
    var item;
    opts = opts || {};
    if( !( item = c_dict[ id ] ) ){
        item = c_dict[ id ] = {
            str : '',
            reference : {}
        }
    }
    item.str = opts.str || item.str || '';
    item.reference = item.reference || {};
    opts.reference && ( item.reference[ opts.reference ] = 1 );
}

function cleanCurrentDictReference(){
    Object.keys( c_dict ).forEach( function( key ){
        c_dict[ key ].reference = {};
    } );
}

function clearDict({ lang = c_lang, str, reference } = {}){
    const target = DICT[lang] || {};
    Object.keys(target).forEach( key => {
        const item = target[key];
        switch(true){
            case str && !item.str:
            case reference && !Object.keys(item.reference).length:
                delete target[key];
        }
    });
}

function clearCurrentDictEmptyItem(){
    clearDict({ str : true });
}

function _( str ){
    var item = c_dict[ str ];
    return ( item && item.str ) ? item.str : str;
}

module.exports = {
    HEADER : [
        'msgid ""',
        'msgstr ""',
        '"MIME-Version: 1.0\\n"',
        '"Content-Type: text/plain; charset=UTF-8\\n"',
        '"Content-Transfer-Encoding: 8bit\\n"'
    ].join('\n'),

    handlePo      : handlePo,
    handlePoTxt   : handlePoTxt,

    _             : _,
    gettext       : _,
    clear         : function() { dict = {}; c_dict = null; },

    setLang                   : setLang,
    getDictByLang             : getDictByLang,
    updateCurrentDict         : updateCurrentDict,
    cleanCurrentDictReference : cleanCurrentDictReference,
    clearCurrentDictEmptyItem : clearCurrentDictEmptyItem,
    clearDict,

    po2obj        : po2obj,
    obj2po        : obj2po
}
